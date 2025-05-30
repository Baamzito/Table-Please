import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<{
    validatedUsersCount: number,
    pendingUsersCount: number,
    totalRestaurantsCount: number
  }> {
    return this.http.get<{
      validatedUsersCount: number,
      pendingUsersCount: number,
      totalRestaurantsCount: number
    }>(`${environment.url}/admin/dashboard`);
  }

  getPendingUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url}/admin/users/pending`);
  }

  validateUser(userId: string): Observable<any> {
    return this.http.post(`${environment.url}/admin/users/${userId}/validate`, {});
  }

  getRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url}/admin/restaurants`);
  }

  addRestaurant(payload: any): Observable<any> {
    return this.http.post(`${environment.url}/admin/restaurants`, payload);
  }

  editRestaurant(id: string, updates: any): Observable<any> {
    return this.http.put(`${environment.url}/admin/restaurants/${id}`, updates);
  }

  deleteRestaurant(id: string): Observable<any> {
    return this.http.delete(`${environment.url}/admin/restaurants/${id}`);
  }

  getValidatedRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url}/admin/restaurants/validated`);
  }
}
