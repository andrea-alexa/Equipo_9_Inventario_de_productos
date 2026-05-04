import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  mensaje: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }
}