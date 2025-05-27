import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  getCart(): Observable<any> {
    return this.http.get<any>(`${environment.url}/cart`);
  }

  addItem(item: any): Observable<any> {
    return this.http.post<any>(`${environment.url}/cart/items`, item);
  }

  updateItem(menuItemId: string, quantity: number): Observable<any> {
    return this.http.put<any>(`${environment.url}/cart/items/${menuItemId}`, {quantity});
  }

  removeItem(menuItemId: string): Observable<any> {
    return this.http.delete<any>(`${environment.url}/cart/items/${menuItemId}`);
  }

  clearCart() {
    return this.http.delete<any>(`${environment.url}/cart`);
  }

  submit(order: any): Observable<any> {
    return this.http.post<any>(`${environment.url}/cart/submit`, order);
  }
}
