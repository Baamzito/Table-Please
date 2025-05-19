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
}
