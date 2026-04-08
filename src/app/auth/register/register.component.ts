import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Inscription</h1>
    <p>Formulaire d'inscription à venir.</p>
    <a routerLink="/login">Déjà un compte ? Se connecter</a>
  `
})
export class RegisterComponent {}
