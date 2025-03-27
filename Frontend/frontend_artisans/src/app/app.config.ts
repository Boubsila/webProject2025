import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { interceptorInterceptor } from './Authentification/addToken.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    //configuration de l'intercepteur
    provideHttpClient(withInterceptors([interceptorInterceptor])),
    importProvidersFrom(HttpClientModule)
  
  ],
};
