// src/app/shared/validators/password-match.validator.ts
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

/**
 * Vérifie que les champs password et confirmPassword
 * contiennent la même valeur.
 * S'applique au FormGroup, pas à un contrôle individuel.
 */
// Fabrique de validateur retournant une ValidatorFn
// POURQUOI: Ce pattern "factory" permet de paramétrer le validateur si besoin
export function passwordMatchValidator(): ValidatorFn {
  // Le paramètre group reçoit le FormGroup entier
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    // Si l'un des champs est vide, on retourne null sans erreur
    // POURQUOI: Signaler une discordance avant que les deux champs soient remplis serait prématuré
    if (!password || !confirmPassword) {
      return null;
    }

    // Retourne l'erreur passwordMismatch si les valeurs diffèrent
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null; // Valide
  };
}
