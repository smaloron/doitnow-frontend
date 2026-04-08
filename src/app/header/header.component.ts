import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  // Fichiers externes pour le template et les styles
  // POURQUOI: Ce composant aura un template HTML conséquent — séparer le HTML du TypeScript
  // améliore la lisibilité et la coloration syntaxique dans l'éditeur
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent {
  // Nom de l'application centralisé dans la classe
  // POURQUOI: Stocké ici (et non en dur dans le HTML) pour faciliter une future modification
  // en un seul endroit
  appName = 'DoItNow';
  // Booléen pilotant l'affichage conditionnel du menu mobile (fermé par défaut)
  isMenuOpen = false;

  // Inverse l'état du menu à chaque appel via l'opérateur NOT logique (!)
  // POURQUOI: Déclenchée par un clic sur le bouton "hamburger" du template —
  // l'opérateur ! transforme true en false et vice-versa en une seule expression
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
