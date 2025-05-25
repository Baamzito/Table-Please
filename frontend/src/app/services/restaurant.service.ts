import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  searchRestaurants(name?: string, city?: string): Observable<any>{
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (city) params = params.set('city', city);

    return this.http.get<any[]>(`${environment.url}/restaurants/search`, { params });
  }

  getAllRestaurants(): Observable<any> {
    return this.http.get<any>(`${environment.url}/restaurants`);
  }

  getRestaurantById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.url}/restaurants/${id}`);
  }

  getOwnerRestaurants(){
    return this.http.get<any>(`${environment.url}/owner/restaurants`);
  }

  createRestaurant(restaurantData: any) {
    return this.http.post<any>(`${environment.url}/owner/restaurants`, restaurantData);
  }

  deleteRestaurant(id: string){
    return this.http.delete<any>(`${environment.url}/owner/restaurants/${id}`);
  }

  updateRestaurant(id: string, restaurantData: any) {
    return this.http.put<any>(`${environment.url}/owner/restaurants/${id}`, restaurantData);
  }

}
