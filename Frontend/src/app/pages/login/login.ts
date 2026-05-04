import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../features/auth/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  iniciarSesion(): void {
    if (!this.email || !this.password) {
      this.error = 'Por favor ingresa tu email y contraseña';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.guardarToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Credenciales incorrectas, intenta de nuevo';
        this.cargando = false;
      }
    });
  }
}