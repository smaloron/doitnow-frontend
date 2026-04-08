// src/app/shared/validators/no-whitespace.validator.ts
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

/**
 * Refuse les valeurs composées uniquement d'espaces.
 * trim() enlève les espaces en début et fin — si la
 * chaîne résultante est vide, la valeur est invalide.
 */
export function noWhitespaceValidator(): ValidatorFn {
  return (
    control: AbstractControl
  ): ValidationErrors | null => {
    // Champ vide retourne null — required gère déjà ce cas
    // POURQUOI: Évite une double erreur confuse si control.value est null, undefined ou chaîne vide
    if (!control.value) {
      return null;
    }

    // trim() supprime les espaces en début/fin — si le résultat est vide,
    // la valeur ne contenait que des espaces
    // POURQUOI: "   " (3 espaces) passerait minLength(3) mais n'est pas un titre utilisable
    const trimmed = (control.value as string).trim();

    if (trimmed.length === 0) {
      // Retourne l'erreur 'whitespaceOnly' vérifiable dans le template via hasError('title', 'whitespaceOnly')
      return { whitespaceOnly: true };
    }

    return null; // Valide
  };
}
