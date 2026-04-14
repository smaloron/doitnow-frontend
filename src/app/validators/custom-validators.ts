import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

/**
 * Vérifie que `password` et `confirmPassword` sont identiques.
 * Ce validateur s'applique au FormGroup, pas à un contrôle seul.
 */
export function passwordMatchValidator(): ValidatorFn {
  return (
    group: AbstractControl
  ): ValidationErrors | null => {
    const password = group.get('password');
    const confirm = group.get('confirmPassword');

    if (!password || !confirm) return null;

    return password.value === confirm.value
      ? null
      : { passwordMismatch: true };
  };
}

/**
 * Vérifie que la date saisie est aujourd'hui ou dans le futur.
 * Cohérent avec la contrainte @FutureOrPresent du backend.
 */
export function futureDateValidator(): ValidatorFn {
  return (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control.value) return null;

    const selected = new Date(control.value);
    const today = new Date();
    // Mise à zéro de l'heure pour comparer uniquement les dates calendaires
    // POURQUOI: sans cela, une date saisie aujourd'hui serait considérée comme passée
    today.setHours(0, 0, 0, 0);

    return selected >= today
      ? null
      : { pastDate: true };
  };
}
