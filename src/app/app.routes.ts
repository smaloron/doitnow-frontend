// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from
  './pages/home/home.component';

export const routes: Routes = [
  // route par défaut qui affiche la page d'accueil
  { path: '', component: HomeComponent },
  // route wildcard qui capture toute URL non reconnue
  // POURQUOI: redirige vers l'accueil plutôt qu'afficher une page 404
  { path: '**', redirectTo: '' }
];
