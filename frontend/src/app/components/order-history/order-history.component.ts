import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule, RouterLink],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css'
})
export class OrderHistoryComponent {
  orders: any[] = [];
  user: any = {};
  loading = false;
  error: string | null = null;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadOrders();
  }

  loadUser() {
    this.userService.getUser().subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load user.';
      }
    });
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load order history.';
        this.loading = false;
      }
    });
  }

  viewOrder(id: string): void {
    this.router.navigate(['/order', id]);
  }

  logout(): void {
    this.authService.logout();
  }
}
