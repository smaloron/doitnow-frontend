import {inject, Injectable} from '@angular/core';
import {Observable, switchMap, map, catchError, of, tap} from 'rxjs';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {TaskService} from '../../services/task.service';
import {TasksActions} from './tasks.action';
import {TaskNotification, TaskWebsocketService} from '../../services/task-websocket-service';
import {NotificationService} from '../../services/notification.service';


@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);
  private wsService = inject(TaskWebsocketService);
  private notifier = inject(NotificationService);

  load$ = createEffect(
    () => this.actions$.pipe(
      ofType(TasksActions.load),
      switchMap(() => this.taskService.getTasks()
        .pipe(
          map(page => TasksActions.loadSuccess({tasks: page.content})),
          tap((data) => console.log(data)),
          catchError(err => of(TasksActions.loadFailure({error: err})))
        )
      )
    )
  );

  realtime$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.subscribeRealtime),
      switchMap(() => {
        this.wsService.connect();

        return this.wsService.notifications$.pipe(
          map(notification => this.mapNotificationToAction(notification))
        );
      })
    )
  );

  private mapNotificationToAction(notification: TaskNotification) {
    switch (notification.type) {
      case 'CREATED':
        return TasksActions.taskCreated({task: notification.task!});

      case 'DELETED':
        return TasksActions.taskDeleted({taskId: notification.taskId});

      case 'UPDATED':
        return TasksActions.taskUpdated({task: notification.task!});

      default:
        throw new Error(`Type de notification non géré : ${notification.type}`);
    }
  }

  notifyCreated$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TasksActions.taskCreated),
      tap(({task}) => {
        console.log('task', task);
        this.notifier.success(`Tâche créée : ${task.title}`)
      })
    )
  }, {dispatch: false}
  );

  notifyUpdated$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(TasksActions.taskUpdated),
        tap(({task}) => {
          this.notifier.info(`Tâche modifiée : ${task.title}`)
        })
      )
    }, {dispatch: false}
  );

  notifyDeleted$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(TasksActions.taskDeleted),
        tap(({taskId}) => {
          this.notifier.info(`Tâche supprimée : ${taskId}`)
        })
      )
    }, {dispatch: false}
  );
}
