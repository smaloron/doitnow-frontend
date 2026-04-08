import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
// Import explicite de la locale française
// POURQUOI: Angular ne charge pas les locales par défaut pour limiter la taille du bundle
import localeFr from '@angular/common/locales/fr';

import { routes } from './app.routes';

// Enregistre les données de localisation française dans Angular
// POURQUOI: Sans cela, le pipe date utiliserait en-US et afficherait "March 27, 2026"
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // LOCALE_ID est un token d'injection qu'Angular utilise pour tous les pipes
    // sensibles à la locale (date, currency, number...)
    // POURQUOI: Définir 'fr-FR' ici applique le français globalement
    { provide: LOCALE_ID, useValue: 'fr-FR' },
  ]
};
