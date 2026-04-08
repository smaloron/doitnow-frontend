// src/app/shared/validators/email-exists.validator.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';
import {
  Observable,
  of,
  timer
} from 'rxjs';
import {
  catchError,
  map,
  switchMap
} from 'rxjs/operators';

// @Injectable({ providedIn: 'root' }) enregistre la classe comme singleton
// POURQUOI: L'injection est nécessaire ici pour accéder à HttpClient
@Injectable({ providedIn: 'root' })
export class EmailExistsValidator {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  /**
   * Retourne un AsyncValidatorFn qui vérifie si l'email
   * est déjà utilisé.
   * Utilise un debounce de 400ms pour éviter un appel API
   * à chaque frappe.
   */
  validate(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Observable<ValidationErrors | null> => {
      // Debounce de 400ms via timer() avant tout appel HTTP
      // POURQUOI: Sans ce délai, chaque caractère saisi déclencherait un appel HTTP
      return timer(400).pipe(
        switchMap(() => {
          // switchMap annule l'Observable précédent si une nouvelle frappe arrive
          return this.http.post(
            `${this.apiUrl}/auth/register`,
            {
              email: control.value,
              // Mot de passe factice pour que le backend ne rejette pas la requête
              // avant de vérifier l'email
              password: 'check_only_DUMMY_pwd_99!'
            }
          ).pipe(
            // Si le backend répond 201 Created, l'email est disponible
            map(() => null),
            catchError((error) => {
              // Inspection du code HTTP et du message pour identifier
              // l'erreur "email déjà utilisé"
              if (
                error.status === 500 &&
                error.error?.message?.includes(
                  'existe déjà'
                )
              ) {
                return of({ emailExists: true });
              }
              // Toute autre erreur réseau retourne null (pas d'erreur de validation)
              // POURQUOI: En cas de coupure réseau, on laisse passer
              return of(null);
            })
          );
        })
      );
    };
  }
}
