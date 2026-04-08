import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  loginForm = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.email]
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(6)]
    ]
  });

  // Accesseurs typés qui encapsulent l'accès aux contrôles du formulaire
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    this.authService
      .login({ email: email!, password: password! })
      .subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => {
          this.isLoading = false;
          // Discrimination du code HTTP pour adapter le message d'erreur
          // POURQUOI: le backend renvoie 401 pour des identifiants invalides
          if (err.status === 401) {
            this.errorMessage =
              'Email ou mot de passe incorrect.';
          } else {
            this.errorMessage =
              'Une erreur est survenue. Réessayez.';
          }
        }
      });
  }
}
