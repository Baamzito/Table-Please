import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurant-detail',
  imports: [CommonModule],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.css'
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: any = null;
  menus: any[] = [];
  error = '';
  selectedModalItem: any = null;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const restaurantId = params['id'];
      if (restaurantId) {
        this.loadRestaurantDetails(restaurantId);
      }
    });
  }

  loadRestaurantDetails(id: string): void {
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (response) => {
        this.restaurant = response.restaurant;
        this.menus = response.menus;
      },
      error: (error) => {
        console.error('Error loading restaurant details:', error);
        this.error = 'Error loading restaurant details';
      }
    });
  }

  getCategorizedItems(menu: any): any {
    const categories: any = {};
    const menuItems = menu.items || [];
   
    menuItems.forEach((item: any) => {
      if (item.available !== false) {
        if (!categories[item.category]) {
          categories[item.category] = [];
        }
        categories[item.category].push(item);
      }
    });
   
    return categories;
  }

  getCategoryNames(menu: any): string[] {
    const categories = this.getCategorizedItems(menu);
    return Object.keys(categories).filter(category => categories[category].length > 0);
  }

  // Add this new method to handle the ID generation
  getCategoryId(menuId: string, categoryName: string): string {
    return `menu-${menuId}-${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
  }

  showModal(item: any): void {
    this.selectedModalItem = item;
    const modalElement = document.getElementById('itemModal');
    if (modalElement) {
      modalElement.style.display = 'block';
      modalElement.classList.add('show');
      document.body.classList.add('modal-open');
     
      let backdrop = document.querySelector('.modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop', 'fade', 'show');
        document.body.appendChild(backdrop);
      }
    }
  }

  closeModal(): void {
    this.selectedModalItem = null;
    const modalElement = document.getElementById('itemModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}