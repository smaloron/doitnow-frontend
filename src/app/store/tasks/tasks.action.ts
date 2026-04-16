import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Task} from '../../models/task.model';

export const TasksActions = createActionGroup(
  {
    source: 'Tasks',
    events: {
      'Load': emptyProps(),
      'Load Success': props< {tasks: Task[]}>(),
      'load Failure': props<{ error: string}>()
    }
  }
)
