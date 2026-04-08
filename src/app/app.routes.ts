// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component')
        .then(m => m.RegisterComponent)
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./task-list/task-list.component')
        .then(m => m.TaskListComponent)
  },
  {
    path: 'tasks/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./tasks/task-form/task-form.component')
        .then(m => m.TaskFormComponent)
  },
  {
    path: 'tasks/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./tasks/task-detail/task-detail.component')
        .then(m => m.TaskDetailComponent)
  },
  {
    path: 'stats',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./stats/stats.component')
        .then(m => m.StatsComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  }
];
