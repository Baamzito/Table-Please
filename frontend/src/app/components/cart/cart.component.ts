import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: res => {
        this.cartItems = res.cart?.items || [];
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Failed to load cart. Please try again later.';
        this.loading = false;
      }
    });
  }

  onQuantityChange(item: any, event: Event) {
    const input = event.target as HTMLInputElement;
    const quantity = input.valueAsNumber;

    if (isNaN(quantity)) {
      this.error = 'Invalid quantity.';
      return;
    }

    if (quantity < 1) {
      this.removeItem(item);
    } else {
      this.updateQuantity(item, quantity);
    }
  }

  updateQuantity(item: any, quantity: number) {
    console.log(quantity)
    this.cartService.updateItem(item.menuItem._id, quantity).subscribe({
      next: () => this.loadCart(),
      error: err => {
        console.error(err);
        this.error = 'Failed to update item quantity.';
      }
    });
  }

  removeItem(item: any) {
    this.cartService.removeItem(item.menuItem._id).subscribe({
      next: () => this.loadCart(),
      error: err => {
        console.error(err);
        this.error = 'Failed to remove item from cart.';
      }
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe({
      next: () => this.loadCart(),
      error: err => {
        console.error(err);
        this.error = 'Failed to clear cart.';
      }
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
