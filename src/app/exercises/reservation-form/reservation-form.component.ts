import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reservation-form.component.html'
})
export class ReservationFormComponent implements OnInit {
  reservationForm!: FormGroup;

  // FormBuilder est injecté par Angular via le constructeur
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // this.fb.group() est la forme courte de new FormGroup()
    // POURQUOI: Chaque entrée [valeur, validateurs] est équivalente à new FormControl(valeur, validateurs)
    this.reservationForm = this.fb.group({
      roomName: ['', Validators.required],
      date:     ['', Validators.required],
      duration: ['', Validators.required]
    });
  }

  // Getters pour accéder aux contrôles depuis le template
  // POURQUOI: Permet d'écrire roomName?.invalid au lieu de reservationForm.get('roomName')?.invalid
  get roomName() {
    return this.reservationForm.get('roomName');
  }
  get date() {
    return this.reservationForm.get('date');
  }
  get duration() {
    return this.reservationForm.get('duration');
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      console.log(this.reservationForm.value);
    }
  }
}
