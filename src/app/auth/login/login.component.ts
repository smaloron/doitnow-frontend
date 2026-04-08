// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      // Email obligatoire avec validation de format
      // POURQUOI: Validators.email seul accepte une chaîne vide — required + email couvrent les deux cas
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      // Mot de passe obligatoire uniquement, sans minLength
      // POURQUOI: En connexion, on ne vérifie pas la longueur — le backend est seul arbitre
      password: ['', Validators.required]
    });
  }

  // Retourne true si le champ email est invalide ET a été visité
  isEmailInvalid(): boolean {
    const ctrl = this.loginForm.get('email');
    return !!(ctrl?.invalid && ctrl.touched);
  }

  // Retourne true si le champ password est invalide ET a été visité
  isPasswordInvalid(): boolean {
    const ctrl = this.loginForm.get('password');
    return !!(ctrl?.invalid && ctrl.touched);
  }

  onSubmit(): void {
    // Garde défensive vérifiant la validité avant toute soumission
    if (this.loginForm.valid) {
      // Appel au service d'authentification (module suivant)
      console.log(this.loginForm.value);
    }
  }
}
