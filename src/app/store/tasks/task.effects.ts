import {inject, Injectable} from '@angular/core';
import {Observable, switchMap, map, catchError, of, tap} from 'rxjs';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {TaskService} from '../../services/task.service';
import {TasksActions} from './tasks.action';


@Injectable()
export class  TasksEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);

  load$ = createEffect(
    () => this.actions$.pipe(
      ofType(TasksActions.load),
      switchMap(() => this.taskService.getTasks()
        .pipe(
          map(page => TasksActions.loadSuccess({ tasks: page.content })),
          tap((data) => console.log(data)),
          catchError(err => of(TasksActions.loadFailure({ error: err })))
        )

      )
    )
  );
}
