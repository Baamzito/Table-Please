import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchForm: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private restaurantService: RestaurantService) {
    this.searchForm = fb.group({
      name: [''],
      city: ['']
    })
   }

  onSearchSubmit(): void {
    const { name, city } = this.searchForm.value;
    this.router.navigate(['/restaurants'], {
      queryParams: {
        name,
        city
      }
    });
  }

}
