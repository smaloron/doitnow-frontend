import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './book-form.component.html'
})
export class BookFormComponent implements OnInit {
  // "!" est une definite assignment assertion TypeScript
  // POURQUOI: Indique à TypeScript que bookForm sera assigné dans ngOnInit() avant usage
  bookForm!: FormGroup;

  ngOnInit(): void {
    // Création du FormGroup — bookForm est invalide dès qu'un contrôle l'est
    // POURQUOI: Le modèle est défini dans le TypeScript (pas dans le HTML),
    // ce qui permet de le tester unitairement sans DOM
    this.bookForm = new FormGroup({
      // Validators.required invalide le contrôle si la valeur est vide
      title: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    // Vérification de validité avant tout traitement
    // POURQUOI: Le bouton est déjà désactivé si invalide, mais cette garde protège
    // contre un appel programmatique accidentel à onSubmit()
    if (this.bookForm.valid) {
      console.log(this.bookForm.value);
    }
  }
}
