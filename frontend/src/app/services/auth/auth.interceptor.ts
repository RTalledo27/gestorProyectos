import { HttpInterceptorFn } from '@angular/common/http';
import { AuthentificationService } from './authentification.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthentificationService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`
      }
    });
  }

  return next(req);
};
