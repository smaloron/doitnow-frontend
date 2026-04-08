// register.component.ts
import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../services/auth.service';
import { passwordMatchValidator } from
  '../../shared/validators/password-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  globalError: string | null = null;

  // passwordMatchValidator est un validateur de niveau groupe
  // POURQUOI: Placé dans les options du groupe car il a besoin d'accéder
  // aux deux champs password et confirmPassword simultanément
  form = this.fb.group(
    {
      email: [
        '',
        [Validators.required, Validators.email]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(8)]
      ],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordMatchValidator() }
  );

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }
  get confirmPassword() {
    return this.form.get('confirmPassword')!;
  }

  ngOnInit(): void {
    // S'abonne à valueChanges pour effacer emailTaken quand l'utilisateur modifie le champ
    // POURQUOI: Signale visuellement que la modification annule l'erreur serveur précédente
    this.email.valueChanges.subscribe(() => {
      const errors = { ...this.email.errors };
      delete errors['emailTaken'];
      this.email.setErrors(
        Object.keys(errors).length ? errors : null
      );
    });
  }

  onSubmit(): void {
    // Guard clause combinée — invalide OU chargement en cours
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;
    this.globalError = null;

    // Destructure uniquement email et password — confirmPassword reste côté client
    const { email, password } = this.form.value;

    this.authService
      .register({ email: email!, password: password! })
      .subscribe({
        next: ({ token }) => {
          this.isLoading = false;
          // Stocke le token JWT dans le localStorage
          localStorage.setItem('auth_token', token);
          this.router.navigate(['/tasks']);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.handleError(err);
        }
      });
  }

  private handleError(err: HttpErrorResponse): void {
    const body = err.error;

    // Détecte le cas "email déjà utilisé" (500 + message spécifique du backend DoItNow)
    // POURQUOI: Injecte l'erreur directement dans le contrôle email pour l'afficher sous le champ
    if (
      err.status === 500 &&
      body?.message?.includes('email existe déjà')
    ) {
      this.email.setErrors({
        ...this.email.errors,
        emailTaken: true
      });
      this.email.markAsTouched();
      return;
    }

    // Fallback — message global générique pour toute erreur non identifiée
    this.globalError =
      'Une erreur est survenue. Veuillez réessayer.';
  }
}
