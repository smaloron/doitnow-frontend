import {HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from '../auth/services/auth.service';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) =>
{
 const authService = inject(AuthService) ;
 const router = inject(Router);

 return next(req).pipe(
   catchError((err) => {
     if(err.status === 401){
       authService.deleteToken();
       router.navigate(['/login']);
     }
     return throwError(err);
   })
 )
}
