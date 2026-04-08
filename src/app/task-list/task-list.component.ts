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

  // injection du service via la fonction inject()
  // POURQUOI: syntaxe recommandée depuis Angular 14 pour les composants standalone
  private taskService = inject(TaskService);

  // tableau local qui contient toutes les tâches récupérées du service
  tasks: Task[] = [];

  // terme saisi dans le champ de recherche, lié au template via two-way binding [(ngModel)]
  searchTerm = '';

  ngOnInit(): void {
    // chargement initial des tâches au démarrage du composant
    // POURQUOI: ngOnInit plutôt que le constructeur — bonnes pratiques Angular
    this.tasks = this.taskService.getTasks();
  }

  // getter qui renvoie les tâches filtrées par le terme de recherche
  // POURQUOI: un getter plutôt qu'une méthode — convention Angular pour les propriétés
  // calculées sans effets de bord
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

  // gestionnaire déclenché par l'événement @Output taskCompleted du TaskCardComponent
  onTaskCompleted(taskId: string): void {
    this.taskService.toggleComplete(taskId);
    // recharge le tableau complet depuis le service
    // POURQUOI: crée une nouvelle référence de tableau pour qu'Angular détecte le changement
    this.tasks = this.taskService.getTasks();
  }

  // gestionnaire déclenché par l'événement @Output taskDeleted du TaskCardComponent
  onTaskDeleted(taskId: string): void {
    this.taskService.deleteTask(taskId);
    this.tasks = this.taskService.getTasks();
  }
}
