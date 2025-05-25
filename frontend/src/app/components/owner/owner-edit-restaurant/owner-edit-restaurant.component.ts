import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RestaurantService } from '../../../services/restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-edit-restaurant',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './owner-edit-restaurant.component.html',
  styleUrl: './owner-edit-restaurant.component.css'
})
export class OwnerEditRestaurantComponent {
  restaurantForm: FormGroup;
  restaurant: any | null = null;
  restaurantId: string = '';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private restaurantService: RestaurantService, private router: Router, private route: ActivatedRoute) {
    this.restaurantForm = this.createForm();
  }

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.params['id'];
    this.loadRestaurant();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: this.formBuilder.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        postcode: ['', [Validators.required, Validators.pattern(/^[0-9]{4}-[0-9]{3}$/)]]
      }),
      contact: this.formBuilder.group({
        phone: ['', [Validators.required, Validators.pattern(/^9[0-9]{8}$/)]],
        email: ['', [Validators.required, Validators.email]]
      })
    });
  }

  private loadRestaurant(): void {
    this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
      next: (response) => {
        this.restaurant = response.restaurant;
        this.populateForm(this.restaurant);
      },
      error: (error) => {
        this.errorMessage = error.error?.message;
        console.error('Error loading restaurant:', error);
      }
    });
  }

  private populateForm(restaurant: any): void {
    this.restaurantForm.patchValue({
      name: restaurant.name,
      address: {
        street: restaurant.address.street,
        city: restaurant.address.city,
        postcode: restaurant.address.postcode
      },
      contact: {
        phone: restaurant.contact.phone,
        email: restaurant.contact.email || ''
      }
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

      this.restaurantService.updateRestaurant(this.restaurantId, restaurantData).subscribe({
        next: () => {
          this.router.navigate(['/owner/restaurants']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message;
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

  goBack(): void {
    this.router.navigate(['/owner/restaurants']);
  }

  // Getters para facilitar acesso aos controles no template
  get name() { return this.restaurantForm.get('name'); }
  get street() { return this.restaurantForm.get('address.street'); }
  get city() { return this.restaurantForm.get('address.city'); }
  get postcode() { return this.restaurantForm.get('address.postcode'); }
  get phone() { return this.restaurantForm.get('contact.phone'); }
  get email() { return this.restaurantForm.get('contact.email'); }
}
