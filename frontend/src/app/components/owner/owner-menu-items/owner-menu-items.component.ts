import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { MenuItemService } from '../../../services/menu-item.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-menu-items',
  imports: [CommonModule, RouterLink],
  templateUrl: './owner-menu-items.component.html',
  styleUrl: './owner-menu-items.component.css'
})
export class OwnerMenuItemsComponent {
  menu: any | null = null;
  restaurant: any | null = null;
  menuItems: any[] = [];
  loading = true;
  errorMessage: string | null = null;
  showDeleteModal = false;
  itemToDelete: any | null = null;
  isDeleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private restaurantService: RestaurantService,
    private menuItemService: MenuItemService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    const menuId = this.route.snapshot.params['menuId'];
    const restaurantId = this.route.snapshot.params['id'];

    if (!menuId || !restaurantId) {
      this.errorMessage = 'Invalid menu or restaurant ID';
      this.loading = false;
      return;
    }

    this.menuService.getMenuById(restaurantId, menuId).subscribe({
      next: (response) => {
        this.menu = response.menu;
        console.log(this.menu)

        this.restaurantService.getRestaurantById(restaurantId).subscribe({
          next: (response) => {
            this.restaurant = response.restaurant;
            console.log(this.restaurant)

            this.menuItemService.getMenuItems(restaurantId, menuId).subscribe({
              next: (response) => {
                this.menuItems = response.menuItems;
                console.log(this.menuItems)
                this.loading = false;
              },
              error: (error) => {
                console.error('Error loading menu items:', error);
                this.errorMessage = 'Failed to load menu items.';
                this.loading = false;
              }
            });
          },
          error: (error) => {
            console.error('Error loading restaurant:', error);
            this.errorMessage = 'Failed to load restaurant data.';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading menu:', error);
        this.errorMessage = 'Failed to load menu.';
        this.loading = false;
      }
    });
  }

  truncateDescription(description: string): string {
    if (!description) return '';
    return description.length > 50 
      ? description.substring(0, 50) + '...' 
      : description;
  }

  openDeleteModal(item: any): void {
    this.itemToDelete = item;
    this.showDeleteModal = true;
    document.body.classList.add('modal-open');
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
    this.isDeleting = false;
    document.body.classList.remove('modal-open');
  }

  confirmDelete(): void {
    if (!this.itemToDelete) return;

    this.isDeleting = true;
    
    this.menuItemService.deleteMenuItem(this.restaurant._id, this.menu._id, this.itemToDelete._id)
      .subscribe({
        next: () => {
          this.menuItems = this.menuItems.filter(
            item => item._id !== this.itemToDelete!._id
          );
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting menu item:', error);
          this.errorMessage = 'Failed to delete menu item. Please try again.';
          this.isDeleting = false;
        }
      });
  }
}
