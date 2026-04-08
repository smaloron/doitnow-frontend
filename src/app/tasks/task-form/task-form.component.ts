// task-form.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { noWhitespaceValidator } from
  '../../shared/validators/no-whitespace.validator';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      // Trois validateurs cumulés sur title : required, minLength, maxLength + noWhitespace
      // POURQUOI: Angular les exécute tous en parallèle et stocke toutes les erreurs actives
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        // noWhitespaceValidator refuse les valeurs composées uniquement d'espaces
        // POURQUOI: Complète minLength — "   " (3 espaces) passerait minLength(3)
        noWhitespaceValidator()
      ]],
      description: ['', Validators.maxLength(500)],
      priority: ['MEDIUM', Validators.required],
      tags: this.fb.array([]),
      dueDate: ['']
    });
  }

  // Méthode générique prenant le nom du contrôle et la clé d'erreur en paramètres
  // POURQUOI: Permet de réutiliser une seule méthode pour tous les champs
  hasError(
    controlName: string,
    errorKey: string
  ): boolean {
    const ctrl = this.taskForm.get(controlName);
    return !!(
      ctrl?.hasError(errorKey) &&
      (ctrl.touched || ctrl.dirty)
    );
  }

  get tags(): FormArray {
    return this.taskForm.get('tags') as FormArray;
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
    if (this.taskForm.valid) {
      console.log(this.taskForm.value);
    }
  }
}
