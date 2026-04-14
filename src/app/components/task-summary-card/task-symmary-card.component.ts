import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

// Interface définie dans le même fichier que le composant qui l'utilise
// POURQUOI: Ces deux éléments sont fortement couplés — un seul import suffit dans DashboardComponent.
// Le type union 'total' | 'completed' | 'pending' | 'overdue' est auto-documenté
// et empêche les fautes de frappe non détectées
export interface TaskSummary {
  label: string;
  count: number;
  type: 'total' | 'completed'
    | 'pending' | 'overdue';
}

@Component({
  selector: 'app-task-summary-card',
  templateUrl:
    './task-summary-card.component.html',
  styleUrl:
    './task-summary-card.component.css',
  standalone: true
})
export class TaskSummaryCardComponent {
  // @Input() avec "!" — le parent doit obligatoirement fournir un objet summary
  // POURQUOI: Le "!" formalise cette obligation et évite une valeur par défaut artificielle —
  // ce composant ne peut pas fonctionner sans données
  @Input() summary!: TaskSummary;
  // Émission du "type" uniquement (ex: 'completed'), pas de l'objet entier
  // POURQUOI: Le type suffit au parent pour savoir quel filtre appliquer,
  // sans lui exposer l'intégralité des données de la carte
  @Output() selected =
    new EventEmitter<string>();

  // Émet le type de la carte au clic
  // POURQUOI: Ce composant ne filtre aucune donnée lui-même —
  // il délègue au DashboardComponent qui centralise la logique de filtrage
  onClick(): void {
    this.selected.emit(this.summary.type);
  }
}
