// login.component.ts
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  // Message d'erreur global affiché sous le formulaire entier
  // POURQUOI: Utilisé quand l'erreur ne peut pas être rattachée à un champ précis (ex. 401)
  globalError: string | null = null;

  // Formulaire de connexion — seulement email et password
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    // Pas de minLength sur password pour la connexion
    // POURQUOI: Les règles de longueur peuvent évoluer côté serveur — on ne veut pas bloquer
    // un utilisateur dont le mot de passe était valide à l'inscription
    password: ['', Validators.required]
  });

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit(): void {
    // Stratégie "à la soumission" — marque tous les contrôles comme touchés
    // POURQUOI: Contrairement à l'inscription (au blur), on attend le clic pour afficher les erreurs
    Object.values(this.form.controls).forEach(c =>
      c.markAsTouched()
    );

    // Guard clause après markAllTouched — les erreurs sont maintenant visibles
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;
    this.globalError = null;

    const { email, password } = this.form.value;

    this.authService
      .login({ email: email!, password: password! })
      .subscribe({
        next: ({ token }) => {
          this.isLoading = false;
          // Stocke le token JWT dans le localStorage après authentification réussie
          localStorage.setItem('auth_token', token);
          this.router.navigate(['/tasks']);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.status === 401) {
            // Message volontairement ambigu pour un 401
            // POURQUOI: Ne pas révéler si l'email existe — prévient l'attaque "user enumeration"
            this.globalError =
              'Identifiants incorrects. '
              + 'Vérifiez votre e-mail et '
              + 'votre mot de passe.';
          } else {
            this.globalError =
              'Impossible de se connecter. '
              + 'Réessayez plus tard.';
          }
        }
      });
  }
}
