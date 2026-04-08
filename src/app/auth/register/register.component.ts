// register.component.ts — version finale complète
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmailExistsValidator } from
  '../../shared/validators/email-exists.validator';
import { passwordMatchValidator } from
  '../../shared/validators/password-match.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    // Injection de EmailExistsValidator qui dépend de HttpClient
    // POURQUOI: Sans DI, il faudrait instancier manuellement — plus fragile et moins testable
    private emailExistsValidator: EmailExistsValidator
  ) {
    this.registerForm = this.fb.group(
      {
        email: [
          '',
          // 2e argument — validateurs synchrones (locaux, sans réseau)
          [Validators.required, Validators.email],
          // 3e argument — validateurs asynchrones, déclenchés uniquement si les synchrones sont valides
          [this.emailExistsValidator.validate()]
        ],
        password: ['', [
          Validators.required,
          Validators.minLength(8)
        ]],
        // confirmPassword n'a que required — la comparaison est déléguée au validateur de groupe
        confirmPassword: ['', Validators.required]
      },
      // Validateur de groupe appliqué au FormGroup entier
      // POURQUOI: Nécessaire pour accéder simultanément à password et confirmPassword
      { validators: passwordMatchValidator() }
    );
  }

  // Méthode centrale de détection d'erreur pour tout le composant
  // POURQUOI: Évite de dupliquer la logique touched/dirty dans chaque *ngIf du template
  hasError(
    controlName: string,
    errorKey: string
  ): boolean {
    const ctrl = this.registerForm.get(controlName);
    return !!(
      ctrl?.hasError(errorKey) &&
      (ctrl.touched || ctrl.dirty)
    );
  }

  // Getter bloquant la soumission si invalid OU pending
  // POURQUOI: pending signifie qu'un validateur asynchrone n'a pas encore répondu
  get isSubmitDisabled(): boolean {
    return (
      this.registerForm.invalid ||
      this.registerForm.pending
    );
  }

  onSubmit(): void {
    // Garde défensive vérifiant validité ET absence de vérification async en cours
    if (this.registerForm.valid && !this.registerForm.pending) {
      const { email, password } = this.registerForm.value;
      // Envoi au service d'authentification (partie 2.4)
      console.log({ email, password });
    }
  }
}
