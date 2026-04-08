import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <h1>Erreur 404 — Page introuvable</h1>
      <p>
        Cette page n'existe pas dans l'application DoItNow.
      </p>
      <a routerLink="/tasks">Retourner à mes tâches</a>
    </div>
  `
})
export class NotFoundComponent {}
