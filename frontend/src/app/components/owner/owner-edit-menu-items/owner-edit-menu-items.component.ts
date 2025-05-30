import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { MenuItemService } from '../../../services/menu-item.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-edit-menu-items',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './owner-edit-menu-items.component.html',
  styleUrl: './owner-edit-menu-items.component.css'
})
export class OwnerEditMenuItemsComponent {
  itemForm!: FormGroup;
  menu: any | null = null;
  restaurant: any | null = null;
  menuItem: any | null = null;
  loading = true;
  isSubmitting = false;
  errorMessage: string | null = null;
  selectedFile: File | null = null;
  isImageRequired = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private restaurantService: RestaurantService,
    private menuItemService: MenuItemService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
  }

  private initializeForm(): void {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]],
      available: [true],
      itemInfo: this.fb.group({
        calories: ['', [Validators.required, Validators.min(0)]],
        proteins: ['', [Validators.required, Validators.min(0)]],
        fats: ['', [Validators.required, Validators.min(0)]],
        carbohydrates: ['', [Validators.required, Validators.min(0)]],
        fiber: ['', [Validators.required, Validators.min(0)]],
        sodium: ['', [Validators.required, Validators.min(0)]]
      })
    });
  }

  private loadData(): void {
    const menuId = this.route.snapshot.params['menuId'];
    const restaurantId = this.route.snapshot.params['id'];
    const itemId = this.route.snapshot.params['itemId'];

    if (!menuId || !restaurantId || !itemId) {
      this.errorMessage = 'Invalid menu, restaurant, or item ID';
      this.loading = false;
      return;
    }

    this.menuItemService.getMenuItemById(restaurantId, menuId, itemId).subscribe({
      next: (response) => {
        this.menuItem = response.menuItem;
        console.log(this.menuItem)
        this.populateForm();
        
        this.menuService.getMenuById(restaurantId, menuId).subscribe({
          next: (response) => {
            this.menu = response.menu;
            
            this.restaurantService.getRestaurantById(restaurantId).subscribe({
              next: (response) => {
                this.restaurant = response.restaurant;
                this.loading = false;
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
      },
      error: (error) => {
        console.error('Error loading menu item:', error);
        this.errorMessage = 'Failed to load menu item.';
        this.loading = false;
      }
    });
  }

  private populateForm(): void {
    if (this.menuItem) {
      this.itemForm.patchValue({
        name: this.menuItem.name,
        description: this.menuItem.description,
        price: this.menuItem.price,
        category: this.menuItem.category,
        available: this.menuItem.available,
        itemInfo: {
          calories: this.menuItem.itemInfo?.calories || '',
          proteins: this.menuItem.itemInfo?.proteins || '',
          fats: this.menuItem.itemInfo?.fats || '',
          carbohydrates: this.menuItem.itemInfo?.carbohydrates || '',
          fiber: this.menuItem.itemInfo?.fiber || '',
          sodium: this.menuItem.itemInfo?.sodium || ''
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const formData = new FormData();
    const formValue = this.itemForm.value;

    formData.append('name', formValue.name);
    formData.append('description', formValue.description);
    formData.append('price', formValue.price.toString());
    formData.append('category', formValue.category);
    formData.append('available', formValue.available.toString());
    formData.append('menuId', this.menu._id);
    
    formData.append('itemInfo_calories', formValue.itemInfo.calories.toString());
    formData.append('itemInfo_proteins', formValue.itemInfo.proteins.toString());
    formData.append('itemInfo_fats', formValue.itemInfo.fats.toString());
    formData.append('itemInfo_carbohydrates', formValue.itemInfo.carbohydrates.toString());
    formData.append('itemInfo_fiber', formValue.itemInfo.fiber.toString());
    formData.append('itemInfo_sodium', formValue.itemInfo.sodium.toString());
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.menuItemService.updateMenuItem(this.restaurant._id, this.menu._id, this.menuItem._id, formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/owner/restaurants', this.restaurant._id, 'menus', this.menu._id, 'items']);
      },
      error: (error) => {
        console.error('Error updating menu item:', error);
        this.errorMessage = error.error?.message || 'Failed to update menu item. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
