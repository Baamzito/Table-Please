import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {

  constructor(private http: HttpClient) { }

  getMenuItems(restaurantId: string, menuId: string): Observable<any> {
    return this.http.get<any>(`${environment.url}/owner/restaurants/${restaurantId}/menus/${menuId}/items`);
  }

  getMenuItemById(restaurantId: string, menuId: string, itemId: string): Observable<any> {
    return this.http.get<any>(`${environment.url}/owner/restaurants/${restaurantId}/menus/${menuId}/items/${itemId}`);
  }

  createMenuItem(restaurantId: string, menuId: string, menuItem: any): Observable<any> {
    return this.http.post<any>(`${environment.url}/owner/restaurants/${restaurantId}/menus/${menuId}/items`, menuItem);
  }

  updateMenuItem(restaurantId: string, menuId: string, itemId: string, menuItem: any): Observable<any> {
    return this.http.put<any>(`${environment.url}/owner/restaurants/${restaurantId}/menus/${menuId}/items/${itemId}`, menuItem);
  }

  deleteMenuItem(restaurantId: string, menuId: string, itemId: string): Observable<any> {
    return this.http.delete<any>(`${environment.url}/owner/restaurants/${restaurantId}/menus/${menuId}/items/${itemId}`);
  }
}
