import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RestaurantService } from '../../../services/restaurant.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-create-restaurant',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './owner-create-restaurant.component.html',
  styleUrl: './owner-create-restaurant.component.css'
})
export class OwnerCreateRestaurantComponent {
  restaurantForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private restaurantService: RestaurantService, private router: Router){
    this.restaurantForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        postcode: ['', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{3}$/)]]
      }),
      contact: this.fb.group({
        phone: ['', [Validators.required, Validators.pattern(/^9[0-9]{8}$/)]],
        email: ['', [Validators.required, Validators.email]]
      })
    });
  }

  onSubmit(): void {
    if (this.restaurantForm.valid) {
      this.errorMessage = '';

      const restaurantData = {
        name: this.restaurantForm.get('name')?.value,
        address_street: this.restaurantForm.get('address.street')?.value,
        address_city: this.restaurantForm.get('address.city')?.value,
        address_postcode: this.restaurantForm.get('address.postcode')?.value,
        contact_phone: this.restaurantForm.get('contact.phone')?.value,
        contact_email: this.restaurantForm.get('contact.email')?.value
      };

      this.restaurantService.createRestaurant(restaurantData).subscribe({
        next: () => {
          this.router.navigate(['/owner/restaurants']);
        },
        error: (error) => {
          if (Array.isArray(error.error?.errors)) {
            this.errorMessage = error.error.errors.join(' ');
          } else if (typeof error.error?.message === 'string') {
            this.errorMessage = error.error.message;
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.restaurantForm.controls).forEach(key => {
      const control = this.restaurantForm.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(nestedKey => {
            control.get(nestedKey)?.markAsTouched();
          });
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/owner/restaurants']);
  }

  get name() { return this.restaurantForm.get('name'); }
  get street() { return this.restaurantForm.get('address.street'); }
  get city() { return this.restaurantForm.get('address.city'); }
  get postcode() { return this.restaurantForm.get('address.postcode'); }
  get phone() { return this.restaurantForm.get('contact.phone'); }
  get email() { return this.restaurantForm.get('contact.email'); }
}
