import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  passwordMatchValidator
} from '../../validators/custom-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  registerForm = this.fb.group(
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
    // Validateur croisé appliqué au FormGroup entier
    // POURQUOI: passwordMatchValidator compare deux champs distincts
    { validators: passwordMatchValidator() }
  );

  get email() { return this.registerForm.get('email'); }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.registerForm.value;
    this.authService
      .register({ email: email!, password: password! })
      .subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => {
          this.isLoading = false;
          // Pose une erreur personnalisée sur le contrôle email en cas de doublon
          // POURQUOI: le backend renvoie 500 pour un email déjà utilisé
          if (err.status === 500) {
            this.email?.setErrors({ emailExists: true });
          } else {
            this.errorMessage =
              'Erreur lors de l\'inscription. Réessayez.';
          }
        }
      });
  }
}
