// task-list.component.ts
import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from
  '../task-card/task-card.component';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskCardComponent, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);

  tasks: Task[] = [];
  searchTerm = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (err) => console.error('Erreur chargement tâches', err)
    });
  }

  get filteredTasks(): Task[] {
    if (!this.searchTerm.trim()) {
      return this.tasks;
    }
    const term = this.searchTerm.toLowerCase();
    return this.tasks.filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term)
    );
  }

  onTaskCompleted(taskId: string): void {
    this.taskService.toggleComplete(taskId).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur toggle', err)
    });
  }

  onTaskDeleted(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur suppression', err)
    });
  }
}
