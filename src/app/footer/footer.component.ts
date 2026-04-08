import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  standalone: true
})
export class FooterComponent {
  // Récupération dynamique de l'année en cours via new Date().getFullYear()
  // POURQUOI: Évite de mettre à jour manuellement l'année du copyright chaque année —
  // le composant se met à jour automatiquement au 1er janvier
  currentYear = new Date().getFullYear();
  appName = 'DoItNow';
}
