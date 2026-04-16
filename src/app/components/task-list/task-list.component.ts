// task-list.component.ts
import {
  Component,
  OnInit,
  inject, OnDestroy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from
    '../task-card/task-card.component';
import { TaskService } from '../../services/task.service';
import {Page, Task} from '../../models/task.model';
import {ExampleService} from '../../services/example.service';
import {Observable, map, catchError, startWith, of} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import {Store} from '@ngrx/store';
import {taskFeature} from '../../store/tasks/tasks.reducer';
import {TasksActions} from '../../store/tasks/tasks.action';

type ViewModel<T> = {
  data?: T;
  error?: string;
  loading: boolean;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskCardComponent, FormsModule, AsyncPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit, OnDestroy {


  // injection du service via la fonction inject()
  // POURQUOI: syntaxe recommandée depuis Angular 14 pour les composants standalone
  private taskService = inject(TaskService);

  private store = inject(Store);

  storeTasks = this.store.select(taskFeature.selectTasks);
  storeLoading = this.store.select(taskFeature.selectLoading);
  storeError = this.store.select(taskFeature.selectError);

  // ViewModel pour gérer l'indicateur de chargement et l'affichage des erreurs
  viewModel$!: Observable<ViewModel<Page<Task>>>;

  // terme saisi dans le champ de recherche, lié au template via two-way binding [(ngModel)]
  searchTerm = '';

  ngOnInit(): void {
    this.viewModel$ = this.taskService.getTasks().pipe(
      map(data =>{
        return {data, loading: false} as ViewModel<Page<Task>>;
      }),
      catchError(err => of({error: err.message, loading: false} as ViewModel<Page<Task>>)),
      startWith({loading: true} as ViewModel<Page<Task>>)
    );

    this.store.dispatch(TasksActions.load());
  }

  ngOnDestroy(): void {

  }

  filterTasks(tasks: Task[]):Task[]{
    if(!this.searchTerm.trim()){
      return tasks;
    }
    const term = this.searchTerm.trim().toLowerCase();
    return tasks.filter((task: Task) => {
      return task.title.toLowerCase().includes(term);
    });
  }



  // gestionnaire déclenché par l'événement @Output taskCompleted du TaskCardComponent
  onTaskCompleted(taskId: string): void {
    this.taskService.toggleComplete(taskId);
    // recharge le tableau complet depuis le service
    // POURQUOI: crée une nouvelle référence de tableau pour qu'Angular détecte le changement
    //this.tasks = this.taskService.getTasks();
  }

  // gestionnaire déclenché par l'événement @Output taskDeleted du TaskCardComponent
  onTaskDeleted(taskId: string): void {
    this.taskService.deleteTask(taskId);
    //this.tasks = this.taskService.getTasks();
  }
}
