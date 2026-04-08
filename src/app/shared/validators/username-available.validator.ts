// src/app/shared/validators/username-available.validator.ts
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Liste des pseudonymes réservés définie en dehors de la fonction
// POURQUOI: Placée au niveau du module pour n'être créée qu'une seule fois en mémoire
const RESERVED_USERNAMES = ['admin', 'root', 'doitnow'];

/**
 * Simule une vérification asynchrone de disponibilité
 * de pseudonyme avec un debounce de 300ms.
 */
export function usernameAvailableValidator():
  AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Observable<ValidationErrors | null> => {
    // Champ vide retourne of(null) immédiatement — required gère ce cas
    if (!control.value) {
      return of(null);
    }

    // Debounce de 300ms via timer(), annulé par switchMap si une nouvelle frappe arrive
    // POURQUOI: Sans debounce, chaque caractère déclencherait une vérification
    return timer(300).pipe(
      switchMap(() => {
        // Normalisation en minuscules + trim pour uniformiser la comparaison
        const normalized =
          (control.value as string).toLowerCase().trim();

        if (RESERVED_USERNAMES.includes(normalized)) {
          return of({ usernameTaken: true });
        }
        return of(null);
      })
    );
  };
}
