import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';

@Component({
  selector: 'app-restaurants',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css'
})
export class RestaurantsComponent implements OnInit {
  restaurants: any[] = [];
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute, 
    private restaurantService: RestaurantService
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      city: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const name = params['name'] || '';
      const city = params['city'] || '';
      this.searchForm.patchValue({ name, city });
      this.fetchRestaurants(name, city);
    });
  }

  fetchRestaurants(name: string, city: string): void {
    this.restaurantService.searchRestaurants(name, city).subscribe({
      next: (response) => this.restaurants = response,
      error: () => this.restaurants = []
    });
  }

  onSearch(): void {
    const { name, city } = this.searchForm.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { name, city },
      queryParamsHandling: 'merge'
    });
  }

  clearFilters() {
    this.searchForm.reset();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }
}