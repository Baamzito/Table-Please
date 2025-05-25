import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user.movel';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUser(): Observable<User>{
    return this.http.get<User>(`${environment.url}/profile`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.post<any>(`${environment.url}/profile/update`, profileData);
  }

}
