import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { MenuService } from '../../../services/menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-create-menu',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './owner-create-menu.component.html',
  styleUrl: './owner-create-menu.component.css'
})
export class OwnerCreateMenuComponent implements OnInit{
  restaurant: any | null = null;
  menuForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  restaurantId: string = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private fb: FormBuilder, 
    private restaurantService: 
    RestaurantService, 
    private menuService: MenuService)
    {
      this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      active: [true, Validators.required]
      });
    }

    ngOnInit(): void {
      this.restaurantId = this.route.snapshot.params['id'];
    }

    loadRestaurant(): void {
    this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
      next: (restaurant) => {
        this.restaurant = restaurant;
      },
      error: (error) => {
        console.error('Error loading restaurant:', error);
        this.errorMessage = error.error?.message;
      }
    });
  }

  onSubmit(): void {
    if (this.menuForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const menuData = {
        name: this.menuForm.get('name')?.value,
        description: this.menuForm.get('description')?.value,
        active: this.menuForm.get('active')?.value,
        restaurantId: this.restaurantId
      };

      this.menuService.createMenu(this.restaurantId, menuData).subscribe({
        next: (response) => {
          this.router.navigate(['/owner/restaurants', this.restaurantId, 'menus']);
        },
        error: (error) => {
          console.error('Error creating menu:', error);
          this.errorMessage = error.error?.message;
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.menuForm.controls).forEach(key => {
        this.menuForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/owner/restaurants', this.restaurantId, 'menus']);
  }

  get name() { return this.menuForm.get('name'); }
  get description() { return this.menuForm.get('description'); }
  get active() { return this.menuForm.get('active'); }
}
