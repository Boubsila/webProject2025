import { HttpInterceptorFn } from '@angular/common/http';

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {
   
  // la requête HTTP est interceptée pour ajouter le token d'authentification 
  // dans le header de la requête
  
  const jwt = sessionStorage.getItem('jwt');
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${jwt}`,
    },
  }); 
  
  return next(authReq);
};
