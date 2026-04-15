import {Component, inject, OnInit} from '@angular/core';
// Import du composant et de l'interface depuis le même fichier
// POURQUOI: Regrouper ces deux exports dans un seul fichier permet un import unique
import {
  TaskSummaryCardComponent,
  TaskSummary
} from '../task-summary-card/task-symmary-card.component';
import {TaskService} from '../../services/task.service';
import {BehaviorSubject, combineLatest, forkJoin, map, Observable, shareReplay} from 'rxjs';
import {TaskStats, Task, Priority} from '../../models/task.model';
import {AsyncPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

type PriorityFilter = 'ALL' | Priority;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  // TaskSummaryCardComponent listé pour résoudre <app-task-summary-card> dans le template
  imports: [TaskSummaryCardComponent, AsyncPipe, FormsModule]
})
// "implements OnInit" engage la classe à définir ngOnInit()
export class DashboardComponent {

  private taskService = inject(TaskService);

  private data$ = forkJoin({
    tasks: this.taskService.getTasks(),
    stats: this.taskService.getStats()
  }).pipe(
    map(({tasks, stats}) => ({stats, tasks: tasks.content})),
    shareReplay(1)
  );

  stats$: Observable<TaskStats> = this.data$.pipe(map(data=> data.stats));
  tasks$: Observable<Task[]> = this.data$.pipe(map(data=> data.tasks));

  private priorityFilter$: BehaviorSubject<PriorityFilter> = new BehaviorSubject<PriorityFilter>('ALL');

  filteredTasks$: Observable<Task[]> = combineLatest([
    this.priorityFilter$,
    this.tasks$])
    .pipe(
      map(([priority, tasks ]) => {
        return priority === 'ALL' ? tasks : tasks.filter(task => task.priority === priority);
      }),
    );

  convertToSummary(stats: TaskStats): TaskSummary[] {
    return [
      { label: 'Total', count: stats.total, type: 'total' },
      { label: 'Terminées', count: stats.completed, type: 'completed' },
      { label: 'En cours', count: stats.pending, type: 'pending' },
      { label: 'En retard', count: stats.overdue, type: 'overdue' },
    ]
  }

  priorities: PriorityFilter[] = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  currentPriority = 'ALL';


  onPriorityChange(priority: PriorityFilter) {
    this.priorityFilter$.next(priority);
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
