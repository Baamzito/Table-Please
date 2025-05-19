import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { DecodedToken } from '../models/decoded-token.model';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient, private router: Router) { }

  signUp(userData: any){
    return this.http.post(`${environment.url}/auth/signup`, userData);
  }

  login(username: string, password: string){
    const body = {username, password};
    return this.http.post<{token: string}>(`${environment.url}/auth/login`, body);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null{
    return localStorage.getItem('token');
  }

  getUser() : DecodedToken | null{
    const token = this.getToken();

    if(!token){
      return null;
    }

    try{
      return jwtDecode<DecodedToken>(token);
    } catch(err){
      console.error('Erro ao decodificar o token:', err);
      return null;
    }
  }

  changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    const body = { currentPassword, newPassword, confirmPassword };
    return this.http.post(`${environment.url}/profile/change-password`, body);
  }

}
