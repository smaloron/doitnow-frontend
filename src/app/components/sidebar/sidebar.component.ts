import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true
})
export class SidebarComponent {
  // Centralisation des libellés de menu dans un tableau
  // POURQUOI: Stocker les items dans la classe (et non en dur dans le HTML) permet de les modifier
  // en un seul endroit et prépare l'intégration future avec @for pour l'affichage dynamique
  menuItems = [
    'Toutes les tâches',
    'En cours',
    'Terminées',
    'En retard'
  ];
  // Booléen contrôlant si la sidebar est repliée (true) ou ouverte (false)
  // POURQUOI: Initialisé à false (visible par défaut) — ce booléen servira dans un exercice futur
  // pour implémenter le comportement de repli
  isCollapsed = false;
}
