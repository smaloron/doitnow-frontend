import { Component, OnInit } from '@angular/core';
// Import du composant et de l'interface depuis le même fichier
// POURQUOI: Regrouper ces deux exports dans un seul fichier permet un import unique
import {
  TaskSummaryCardComponent,
  TaskSummary
} from '../task-summary-card/task-symmary-card.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  // TaskSummaryCardComponent listé pour résoudre <app-task-summary-card> dans le template
  imports: [TaskSummaryCardComponent]
})
// "implements OnInit" engage la classe à définir ngOnInit()
export class DashboardComponent
  implements OnInit {

  // Source de données centrale du dashboard, typée TaskSummary[]
  // POURQUOI: Le type garantit que chaque élément respecte la structure attendue par l'enfant.
  // Dans une vraie application, ces données seraient chargées depuis l'API
  // (GET /api/tasks/stats) dans ngOnInit() via un service HTTP
  summaries: TaskSummary[] = [
    {
      label: 'Total',
      count: 8,
      type: 'total'
    },
    {
      label: 'Terminées',
      count: 2,
      type: 'completed'
    },
    {
      label: 'En cours',
      count: 6,
      type: 'pending'
    },
    {
      label: 'En retard',
      count: 1,
      type: 'overdue'
    }
  ];

  ngOnInit(): void {
    // Initialisation du dashboard
    // POURQUOI: ngOnInit est préféré au constructeur car les @Input() sont déjà valorisés —
    // dans une vraie application, on appellerait ici un service HTTP pour les statistiques
    console.log(
      'Dashboard initialisé avec',
      this.summaries.length,
      'cartes'
    );
  }

  // Reçoit le "type" émis par TaskSummaryCardComponent via @Output "selected"
  // POURQUOI: C'est ici que serait déclenchée la logique de filtrage dans une vraie application —
  // $event dans le template contient la valeur passée à emit() dans onClick() de l'enfant
  onSummarySelected(type: string): void {
    console.log(
      'Filtre sélectionné :',
      type
    );
  }
}
