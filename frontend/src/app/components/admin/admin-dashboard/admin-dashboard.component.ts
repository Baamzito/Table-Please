import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  validatedUsersCount = 0;
  pendingUsersCount = 0;
  totalRestaurantsCount = 0;
  pendingUsers: any[] = [];
  restaurantsList: any[] = [];
  error: string | null = null;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.validatedUsersCount = stats.validatedUsersCount;
        this.pendingUsersCount = stats.pendingUsersCount;
        this.totalRestaurantsCount = stats.totalRestaurantsCount;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load statistics.';
      }
    });

    this.adminService.getPendingUsers().subscribe({
      next: (users) => this.pendingUsers = users,
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load pending users.';
      }
    });
  }

  validateUser(userId: string): void {
    if (!confirm('Are you sure you want to validate this restaurant user?')) return;

    this.adminService.validateUser(userId).subscribe({
      next: () => this.loadDashboardData(),
      error: (err) => {
        console.error(err);
        this.error = 'Failed to validate user.';
      }
    });
  }

  deleteRestaurant(restaurantId: string): void {
    if (!confirm('Are you sure you want to remove this restaurant?')) return;

    this.adminService.deleteRestaurant(restaurantId).subscribe({
      next: () => this.loadDashboardData(),
      error: (err) => {
        console.error(err);
        this.error = 'Failed to delete restaurant.';
      }
    });
  }

  goToEditRestaurant(id: string): void {
    this.router.navigate(['/admin/restaurants/edit', id]);
  }

  goToAddRestaurant(): void {
    this.router.navigate(['/admin/restaurants/add']);
  }
}
