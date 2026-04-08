// Import du trio Input/Output/EventEmitter pour la communication inter-composants
import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
// Import de l'interface Task pour le typage fort
// POURQUOI: Garantit que ce composant ne peut recevoir qu'un objet conforme au modèle Task —
// TypeScript signalera toute propriété manquante ou mal typée
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
  standalone: true
})
export class TaskCardComponent {
  // @Input() avec "!" (definite assignment assertion) — le parent DOIT fournir une tâche
  // POURQUOI: Le "!" dit à TypeScript "cette propriété sera initialisée via @Input avant usage" —
  // sans lui, TypeScript refuserait la compilation. C'est un compromis : on accepte la responsabilité
  // de s'assurer que le parent fournit toujours cette valeur
  @Input() task!: Task;

  // Deux @Output distincts pour émettre des événements vers le parent
  // POURQUOI: Nommés au passé ('deleted', 'toggled') par convention Angular —
  // indique que l'action a eu lieu côté enfant et que le parent doit y réagir.
  // EventEmitter<string> transmet l'identifiant de la tâche
  @Output() deleted =
    new EventEmitter<string>();
  @Output() toggled =
    new EventEmitter<string>();

  // Émet l'id de la tâche vers le parent au clic sur "Supprimer"
  // POURQUOI: Ce composant n'effectue aucune suppression lui-même — il délègue au parent
  // qui décide comment réagir (appel API, mise à jour de la liste, etc.)
  onDelete(): void {
    this.deleted.emit(this.task.id);
  }

  // Émet l'id de la tâche pour basculer l'état "terminée / non terminée"
  // POURQUOI: L'enfant n'a pas accès à la liste complète des tâches —
  // il délègue la mise à jour au parent qui possède l'état global
  onToggleComplete(): void {
    this.toggled.emit(this.task.id);
  }
}
