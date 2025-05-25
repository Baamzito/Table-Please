import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-owner-restaurants',
  imports: [CommonModule, RouterLink],
  templateUrl: './owner-restaurants.component.html',
  styleUrl: './owner-restaurants.component.css'
})
export class OwnerRestaurantsComponent implements OnInit{
  restaurants: any[] = [];
  success: string | null = null;
  error: string | null = null;

  constructor(private restaurantService: RestaurantService) { }

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.restaurantService.getOwnerRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
      },
      error: (err) => {
        this.error = 'Failed to load restaurants. Please try again.';
        console.error(err);
      }
    });
  }

  deleteRestaurant(id: string): void {
    this.restaurantService.deleteRestaurant(id).subscribe({
      next: (response) => {
        this.success = response.message;
        this.loadRestaurants();
      },
      error: (err) => {
        this.error = err.error?.message;
        console.error(err);
      }
    });
  }

  closeAlert(type: 'success' | 'error'): void {
    if (type === 'success') {
      this.success = null;
    } else {
      this.error = null;
    }
  }
}
