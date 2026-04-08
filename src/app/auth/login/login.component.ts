import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Connexion</h1>
    <p>Formulaire de connexion à venir.</p>
    <a routerLink="/register">Créer un compte</a>
  `
})
export class LoginComponent {}
