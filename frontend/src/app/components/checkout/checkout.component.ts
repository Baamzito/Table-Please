import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  checkoutForm!: FormGroup;
  submitting = false;
  error: string | null = null;
  cartItems: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{9,15}$/)]],
      citizenCardNumber: ['', Validators.required],
      type: ['delivery', Validators.required],
      paymentMethod: ['cash', Validators.required]
    });

    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cartItems = res.cart?.items || [];

        if (this.cartItems.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load cart items.';
      }
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  submitOrder(): void {
    if (this.checkoutForm.invalid || this.cartItems.length === 0) return;

    this.submitting = true;
    this.error = null;

    const formData = this.checkoutForm.value;

    const orderPayload = {
      deliveryDetails: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode
      },
      contact: formData.phone,
      type: formData.type,
      paymentMethod: formData.paymentMethod,
      citizenCardNumber: formData.citizenCardNumber,
      paymentStatus: 'paid',
      deliveryStatus: 'pending'
    };

    this.cartService.submit(orderPayload).subscribe({
      next: (res) => {
        const orderId = res.order?._id;
        this.router.navigate(['/order', orderId]);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Failed to submit order.';
        this.submitting = false;
      }
    });
  }
}
