// task-card.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  DatePipe,
  TitleCasePipe,
  NgClass,
  NgStyle,
} from '@angular/common';
import { RelativeDatePipe } from
  '../pipes/relative-date.pipe';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  // Toutes les dépendances du template (pipes, directives) listées explicitement
  // POURQUOI: En standalone, oublier un import provoque une erreur de compilation
  imports: [
    DatePipe, TitleCasePipe, NgClass,
    NgStyle, RelativeDatePipe,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
})
export class TaskCardComponent {
  @Input() task!: Task;

  @Output() deleted =
    new EventEmitter<string>();
  @Output() toggled =
    new EventEmitter<string>();

  // Vérifie si la tâche est dépassée en normalisant les dates à minuit
  isOverdue(): boolean {
    if (!this.task.dueDate || this.task.completed) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(this.task.dueDate) < today;
  }

  // Mappe chaque priorité à une couleur CSS
  // POURQUOI: Centralisation DRY — un seul endroit à modifier si la palette change
  getPriorityColor(): string {
    const colors: Record<string, string> = {
      LOW: '#6c757d',
      MEDIUM: '#0d6efd',
      HIGH: '#fd7e14',
      URGENT: '#dc3545',
    };
    return colors[this.task.priority] ?? '#6c757d';
  }

  // Getter retournant un objet de classes CSS dont une seule sera true à la fois
  // POURQUOI: Un getter est recalculé à chaque cycle de détection
  get priorityClasses(): Record<string, boolean> {
    return {
      'priority-low': this.task.priority === 'LOW',
      'priority-medium': this.task.priority === 'MEDIUM',
      'priority-high': this.task.priority === 'HIGH',
      'priority-urgent': this.task.priority === 'URGENT',
    };
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    console.log(
      'Suppression demandée pour :',
      this.task.title
    );
    this.deleted.emit(this.task.id);
  }

  onToggleComplete(): void {
    this.toggled.emit(this.task.id);
  }
}
