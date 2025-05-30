import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-owner-manage-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './owner-manage-orders.component.html',
  styleUrl: './owner-manage-orders.component.css'
})
export class OwnerManageOrdersComponent implements OnInit {
  orders: any[] = [];
  restaurantId: string = '';
  loading = false;
  error: string | null = null;
  toastMessage: string | null = null;

  private socket = io('http://localhost:3000');

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.restaurantId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.restaurantId) {
      this.router.navigate(['/owner/restaurants']);
      return;
    }

    this.socket.emit('joinRestaurantRoom', this.restaurantId);

    this.socket.on('newOrder', (data) => {
      if (data.restaurantId === this.restaurantId) {
        this.showToast(`Nova encomenda recebida! €${data.total} (${data.type})`);

        this.orders.unshift({
          _id: data.orderId,
          contact: data.contact,
          type: data.type,
          totalPrice: data.total,
          deliveryStatus: 'pending',
          createdAt: new Date()
        });
      }
    });

    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrdersByRestaurant(this.restaurantId).subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Failed to load restaurant orders.';
        this.loading = false;
      }
    });
  }

  viewOrder(orderId: string): void {
    this.router.navigate(['/order', orderId]);
  }

  updateStatus(orderId: string, newStatus: string): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const order = this.orders.find(o => o._id === orderId);
        if (order) order.deliveryStatus = newStatus;
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Failed to update order.';
      }
    });
  }

  startPreparation(order: any): void {
    this.updateStatus(order._id, 'inProgress');
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
    }, 5000);
  }
}
