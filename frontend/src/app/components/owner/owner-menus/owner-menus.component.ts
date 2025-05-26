import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { MenuService } from '../../../services/menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-menus',
  imports: [CommonModule],
  templateUrl: './owner-menus.component.html',
  styleUrl: './owner-menus.component.css'
})
export class OwnerMenusComponent implements OnInit{
  restaurant: any | null = null;
  menus: any[] = [];
  restaurantId: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  isDeletingMenu: string = '';
  menuToDelete: any | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private menuService: MenuService, private restaurantService: RestaurantService) {}

  ngOnInit(): void {
      this.restaurantId = this.route.snapshot.params['id'];
      this.loadRestaurantAndMenus();
  }

  private loadRestaurantAndMenus(): void {
    this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
      next: (res) => {
        this.restaurant = res.restaurant || null;
        this.menuService.getMenusByRestaurant(this.restaurantId).subscribe({
          next: (menuRes) => {
            this.menus = menuRes.menus || [];
          },
          error: (menuErr) => {
            this.errorMessage = menuErr.error?.message;
            console.error('Error loading menus:', menuErr);
          }
        });
      },
      error: (restErr) => {
        this.errorMessage = restErr.error?.message;
        console.error('Error loading restaurant:', restErr);
      }
    });
  }

  navigateToCreateMenu(): void {
    this.router.navigate(['/owner/restaurants', this.restaurantId, 'menus', 'create']);
  }

  navigateToManageItems(menuId: string): void {
    this.router.navigate(['/owner/restaurants', this.restaurantId, 'menus', menuId, 'items']);
  }

  navigateToEditMenu(menuId: string): void {
    this.router.navigate(['/owner/restaurants', this.restaurantId, 'menus', menuId, 'edit']);
  }

  navigateToMyRestaurants(): void {
    this.router.navigate(['/owner/restaurants']);
  }

  truncateDescription(description: string | undefined, maxLength: number = 100): string {
    if (!description) return '';
    return description.length > maxLength 
      ? description.substring(0, maxLength) + '...' 
      : description;
  }

  openDeleteModal(menu: any): void {
    this.menuToDelete = menu;
  }

  closeDeleteModal(): void {
    this.menuToDelete = null;
  }

  confirmDeleteMenu(): void {
    if (!this.menuToDelete) return;
    
    this.isDeletingMenu = this.menuToDelete._id;
    
    this.menuService.deleteMenu(this.restaurantId, this.menuToDelete._id).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        this.menus = this.menus.filter(menu => menu._id !== this.menuToDelete?._id);
        this.closeDeleteModal();
        this.isDeletingMenu = '';
      },
      error: (error) => {
        this.errorMessage = error.error?.message;
        this.successMessage = '';
        this.isDeletingMenu = '';
        console.error('Error deleting menu:', error);
      }
    });
  }

  dismissAlert(type: 'success' | 'error'): void {
    if (type === 'success') {
      this.successMessage = '';
    } else {
      this.errorMessage = '';
    }
  }
}
