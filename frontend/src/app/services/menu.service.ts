import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  getMenusByRestaurant(id: string): Observable<any> {
    return this.http.get<any>(`${environment.url}/owner/restaurants/${id}/menus`);
  }

  getMenuById(restaurantId: string, menuId: string): Observable<any> {
    return this.http.get<any>(`${environment.url}/owner/restaurants/${restaurantId}/menus/${menuId}`);
  }

  createMenu(id: string, menuData: any): Observable<any>{
    return this.http.post<any>(`${environment.url}/owner/restaurants/${id}/menus`, menuData);
  }

  updateMenu(restaurantId: string, menuId: string, menuData: any): Observable<any>{
    return this.http.put<any>(`${environment.url}/owner/restaurants/${restaurantId}/menus/${menuId}`, menuData);
  }

  deleteMenu(restaurantId: string, menuId: string): Observable<any>{
    return this.http.delete<any>(`${environment.url}/owner/restaurants/${restaurantId}/menus/${menuId}`);
    
  }
}
