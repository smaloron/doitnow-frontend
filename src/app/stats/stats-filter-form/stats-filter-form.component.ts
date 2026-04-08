import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-filter-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './stats-filter-form.component.html'
})
export class StatsFilterFormComponent implements OnInit {
  filterForm!: FormGroup;

  // 'ALL' est inclus en plus des valeurs backend
  // POURQUOI: Permet de désactiver le filtre par priorité sans supprimer le champ
  readonly priorities = [
    'ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      // 'ALL' est la valeur par défaut — aucun filtre par priorité au départ
      priority:      ['ALL', Validators.required],
      // fb.array([]) initialise un FormArray vide
      // POURQUOI: Les tags ne sont ajoutés que si l'utilisateur clique sur "Ajouter un tag"
      tags:          this.fb.array([]),
      // [true] initialise la case à cocher à "cochée"
      showCompleted: [true]
    });
  }

  get priority() {
    return this.filterForm.get('priority');
  }

  // Accesseur typé FormArray pour accéder aux méthodes push() et removeAt()
  get tags(): FormArray {
    return this.filterForm.get('tags') as FormArray;
  }

  get showCompleted() {
    return this.filterForm.get('showCompleted');
  }

  addTag(): void {
    // Ajout d'un FormControl vide avec Validators.required
    // POURQUOI: Empêche l'utilisateur de laisser un tag vide
    this.tags.push(
      this.fb.control('', Validators.required)
    );
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  onSubmit(): void {
    if (this.filterForm.valid) {
      console.log(this.filterForm.value);
    }
  }
}
