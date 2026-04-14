// src/app/app.routes.ts
import {Routes} from '@angular/router';
import {HomeComponent} from
    './components/pages/home/home.component';
import {authGuard} from './auth/guards/auth.guard';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';


export const routes: Routes = [
  // route par défaut qui affiche la page d'accueil
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

  {path: 'tasks', loadComponent: () =>
      import('./components/task-list/task-list.component')
        .then(m => m.TaskListComponent)},
  {
    path: 'tasks/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/task-form/task-form.component')
        .then(m => m.TaskFormComponent)
  },
  {
    path: 'task/:id',
    loadComponent: () =>
      import('./components/task-details-component/task-details-component')
        .then(m => m.TaskDetailsComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  // route wildcard qui capture toute URL non reconnue
  // POURQUOI: redirige vers l'accueil plutôt qu'afficher une page 404
  {path: '**', redirectTo: ''}
];
