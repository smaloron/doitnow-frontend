// src/app/header/header.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // nom de l'application affiché dans la barre de navigation
  // POURQUOI: readonly car cette valeur ne changera jamais
  readonly appName = 'DoItNow';
}
