import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../features/auth/services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  if (token) {
    const reqConToken = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(reqConToken);
  }

  return next(req);
};