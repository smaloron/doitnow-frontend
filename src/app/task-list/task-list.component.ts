// task-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from
  '../task-card/task-card.component';
import { Task, TaskStats } from '../models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  // Déclaration de TaskCardComponent et FormsModule comme dépendances du template
  imports: [TaskCardComponent, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);

  tasks: Task[] = [];

  // false par défaut — les tâches terminées sont masquées au chargement
  // POURQUOI: L'utilisateur veut généralement voir ce qui reste à faire
  showCompleted = false;

  // Propriété liée au champ de recherche via [(ngModel)]
  searchKeyword: string = '';

  stats: TaskStats = {
    total: 0,
    completed: 0,
    pending: 0
  };

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
    this.updateStats();
  }

  // Getter qui retourne les tâches filtrées selon showCompleted
  // POURQUOI: Un getter offre une syntaxe plus propre dans le template
  // et est recalculé à chaque cycle de détection
  get displayedTasks(): Task[] {
    if (this.showCompleted) {
      return this.tasks;
    }
    // filter() crée un nouveau tableau sans modifier this.tasks
    return this.tasks.filter(t => !t.completed);
  }

  // Getter retournant le nombre de tâches non terminées
  get pendingCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  // Inverse le booléen showCompleted pour basculer le filtre
  toggleShowCompleted(): void {
    this.showCompleted = !this.showCompleted;
  }

  onTaskToggled(taskId: string): void {
    this.taskService.toggleComplete(taskId);
    this.tasks = this.taskService.getTasks();
    this.updateStats();
  }

  onTaskDeleted(taskId: string): void {
    this.taskService.deleteTask(taskId);
    this.tasks = this.taskService.getTasks();
    this.updateStats();
  }

  private updateStats(): void {
    this.stats = {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.completed).length,
      pending: this.tasks.filter(t => !t.completed).length
    };
  }
}
