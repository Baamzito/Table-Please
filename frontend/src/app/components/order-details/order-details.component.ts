import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {
  order: any = null;
  error: string | null = null;
  loading = false;
  cancelling = false;
  countdown: string = '';
  private countdownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.router.navigate(['/']);
      return;
    }

    this.loading = true;
    this.orderService.getOrderById(orderId).subscribe({
      next: (res) => {
        this.order = res;
        this.loading = false;
        if (this.canCancel(this.order)) {
          this.startCountdown();
        }
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Failed to load order details.';
        this.loading = false;
      }
    });
  }

  getTotal(): number {
    return this.order?.items?.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0) || 0;
  }

  canCancel(order: any): boolean {
    const createdAt = new Date(order.createdAt).getTime();
    const now = new Date().getTime();
    const fiveMinutes = 5 * 60 * 1000;
    return now - createdAt <= fiveMinutes && order.deliveryStatus === 'pending';
  }

  cancelOrder(): void {
    if (!this.order?._id) return;

    this.cancelling = true;
    this.orderService.cancelOrder(this.order._id).subscribe({
      next: () => {
        this.order.deliveryStatus = 'cancelled';
        this.cancelling = false;
        clearInterval(this.countdownInterval);
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Failed to cancel order.';
        this.cancelling = false;
      }
    });
  }

  private startCountdown(): void {
    const createdAt = new Date(this.order.createdAt).getTime();
    const deadline = createdAt + 5 * 60 * 1000;

    this.updateCountdown(deadline);
    this.countdownInterval = setInterval(() => {
      this.updateCountdown(deadline);
    }, 1000);
  }

  private updateCountdown(deadline: number): void {
    const now = new Date().getTime();
    const remaining = deadline - now;

    if (remaining <= 0) {
      this.countdown = 'Expired';
      clearInterval(this.countdownInterval);
      return;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    this.countdown = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
