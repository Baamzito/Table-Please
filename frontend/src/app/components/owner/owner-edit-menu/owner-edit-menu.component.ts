import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-edit-menu',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './owner-edit-menu.component.html',
  styleUrl: './owner-edit-menu.component.css'
})
export class OwnerEditMenuComponent {
  menuForm: FormGroup;
  menu: any | null = null;
  restaurant: any | null = null;
  restaurantId: string = '';
  loading = true;
  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private restaurantService: RestaurantService
  ) {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      active: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    const menuId = this.route.snapshot.params['menuId'];
    this.restaurantId = this.route.snapshot.params['id'];

    if (!menuId || !this.restaurantId) {
      this.errorMessage = 'Invalid menu or restaurant ID';
      this.loading = false;
      return;
    }

    this.menuService.getMenuById(this.restaurantId, menuId).subscribe({
      next: (response) => {
        this.menu = response.menu;
        this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
          next: (response) => {
            this.restaurant = response.restaurant;
            
            this.menuForm.patchValue({
              name: this.menu.name,
              description: this.menu.description,
              active: this.menu.active
            });

            this.loading = false;
          },
          error: (error) => {
            console.error('Erro ao carregar restaurante:', error);
            this.errorMessage = 'Erro ao carregar dados do restaurante';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Erro ao carregar menu:', error);
        this.errorMessage = 'Erro ao carregar dados do menu';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.menuForm.valid && this.menu) {
      this.isSubmitting = true;
      this.errorMessage = null;

      const formValue = this.menuForm.value;
      const updatedMenu = {
        ...this.menu,
        name: formValue.name,
        description: formValue.description,
        active: formValue.active
      };

      this.menuService.updateMenu(this.restaurantId, this.menu._id, updatedMenu)
        .subscribe({
          next: () => {
            this.router.navigate(['/owner/restaurants', this.restaurantId, 'menus']);
          },
          error: (error) => {
            console.error('Error updating menu:', error);
            this.errorMessage = error.error?.message;
            this.isSubmitting = false;
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.menuForm.controls).forEach(key => {
      const control = this.menuForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/owner/restaurants', this.restaurantId, 'menus']);
  }

  get name() { return this.menuForm.get('name'); }
  get description() { return this.menuForm.get('description'); }
  get active() { return this.menuForm.get('active'); }
}
