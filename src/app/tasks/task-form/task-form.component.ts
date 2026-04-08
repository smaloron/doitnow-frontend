// task-form.component.ts
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { noWhitespaceValidator } from
  '../../shared/validators/no-whitespace.validator';
// TaskService sera utilisé pour les appels HTTP dans les modules suivants

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Drapeau de chargement, false au démarrage (pas d'appel en cours)
  isLoading = false;
  // Erreur globale pour les erreurs serveur non rattachées à un champ
  globalError: string | null = null;

  form: FormGroup = this.fb.group({
    // Trois validateurs cumulés sur title : required, minLength, maxLength + noWhitespace
    title: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
      noWhitespaceValidator()
    ]],
    description: ['', Validators.maxLength(500)],
    priority: ['MEDIUM', Validators.required],
    tags: this.fb.array([]),
    dueDate: ['']
  });

  // Méthode générique prenant le nom du contrôle et la clé d'erreur en paramètres
  // POURQUOI: Permet de réutiliser une seule méthode pour tous les champs
  hasError(
    controlName: string,
    errorKey: string
  ): boolean {
    const ctrl = this.form.get(controlName);
    return !!(
      ctrl?.hasError(errorKey) &&
      (ctrl.touched || ctrl.dirty)
    );
  }

  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  get dueDate() {
    return this.form.get('dueDate')!;
  }

  addTag(): void {
    this.tags.push(
      this.fb.control('', Validators.required)
    );
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  onSubmit(): void {
    // Guard clause combinée — vérifie la validité ET l'état de chargement
    // POURQUOI: La vérification de isLoading protège contre le double-clic
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;
    this.globalError = null;

    // Simulation d'un appel async — sera remplacé par un vrai appel HTTP
    console.log('Tâche créée :', this.form.value);
    this.isLoading = false;
    this.router.navigate(['/tasks']);
  }

  private handleTaskError(err: HttpErrorResponse): void {
    // Vérifie statut 400 ET que le corps est un objet (pas une string ou null)
    // POURQUOI: typeof === 'object' protège contre les réponses mal formées du serveur
    if (err.status === 400 && typeof err.error === 'object') {
      // Caste en Record<string, string> puis itère sur les paires [champ, message]
      Object.entries(err.error as Record<string, string>)
        .forEach(([field, message]) => {
          const ctrl = this.form.get(field);
          if (ctrl) {
            // Injecte le message serveur sous la clé "serverError"
            // POURQUOI: Contrairement à emailTaken (qui vaut juste true), on stocke le message texte
            // pour pouvoir l'afficher dynamiquement dans le template
            ctrl.setErrors({
              ...ctrl.errors,
              serverError: message as string
            });
            ctrl.markAsTouched();
          }
        });
    } else {
      this.globalError =
        'Une erreur est survenue lors de la sauvegarde.';
    }
  }
}
