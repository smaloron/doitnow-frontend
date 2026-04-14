import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthCredentials, AuthService} from '../services/auth.service';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['user@example.com', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(6)]],
  })

  get email() { return this.loginForm.controls['email'] }
  get password() { return this.loginForm.controls['password'] }

  onSubmit() {
    if (this.loginForm.valid) {
      let credentials: AuthCredentials = {
        email : this.loginForm.controls['email'].value,
        password : this.loginForm.controls['password'].value
      }
      this.authService.login(credentials).subscribe({
        next: res => {
          this.authService.setToken(res.token);
          console.log(res);
          this.router.navigate(['/tasks']);
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

}
