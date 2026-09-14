import { Injectable } from '@angular/core';
import { Login } from '../models/Login';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) { }

  login(user: Login): Observable<string> {
    return this.httpClient.post('/api/login', user, {
    responseType: 'text'
  });
  }
  
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
