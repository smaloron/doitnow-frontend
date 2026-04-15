import { Component, inject } from '@angular/core';
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
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
    this.authService.register({ email: email!, password: password! }).subscribe(
      {
        next: res => {
          this.router.navigate(['/tasks']);
        },
        error: err => { console.log(err); }
      }
    );
  }
}
