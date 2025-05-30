import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getOrderById(id: string): Observable<any> {
    return this.http.get(`${environment.url}/order/${id}`);
  }

  getMyOrders(): Observable<any> {
    return this.http.get(`${environment.url}/order/user`);
  }

  getOrdersByRestaurant(restaurantId: string): Observable<any> {
    return this.http.get(`${environment.url}/order/restaurant/${restaurantId}`);
  }

  cancelOrder(id: string): Observable<any> {
    return this.http.put(`${environment.url}/order/${id}/cancel`, {});
  }

  updateOrderStatus(id: string, status: string) {
    return this.http.put(`${environment.url}/order/${id}/status`, { status });
  }
}