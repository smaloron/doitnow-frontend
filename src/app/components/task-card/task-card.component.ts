// task-card.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Task } from '../../models/task.model';
import { NgClass } from '@angular/common';
import { RelativeDatePipe } from
        '../../pipes/relative-date.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [NgClass, RelativeDatePipe, DatePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {

  // la tâche à afficher, fournie par le composant parent
  // POURQUOI: required: true génère une erreur à la compilation si le parent oublie de passer [task]
  @Input({ required: true }) task!: Task;

  // événement émis vers le parent quand l'utilisateur clique sur "Terminer"
  // POURQUOI: le composant carte ne modifie pas la donnée lui-même — il délègue au parent
  @Output() taskCompleted = new EventEmitter<string>();

  // événement émis vers le parent quand l'utilisateur clique sur "Supprimer"
  @Output() taskDeleted = new EventEmitter<string>();

  // mappe chaque code de priorité vers un libellé en français
  // POURQUOI: Record<string, string> plutôt qu'un switch — plus concis et facile à enrichir
  getPriorityLabel(): string {
    const labels: Record<string, string> = {
      LOW: 'Basse',
      MEDIUM: 'Normale',
      HIGH: 'Haute',
      URGENT: 'Urgente'
    };
    return labels[this.task.priority] ?? this.task.priority;
  }

  // détermine si la tâche est en retard par rapport à la date du jour
  // POURQUOI: une tâche complétée n'est jamais "en retard" même si sa date est passée
  isOverdue(): boolean {
    if (!this.task.dueDate || this.task.completed) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(this.task.dueDate) < today;
  }

  onComplete(): void {
    this.taskCompleted.emit(this.task.id);
  }

  onDelete(): void {
    this.taskDeleted.emit(this.task.id);
  }
}
