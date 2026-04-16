import { Task } from '../../models/task.model';
import {createFeature, createReducer, on} from '@ngrx/store';
import { TasksActions } from './tasks.action';

export interface TaskState {
  loading: boolean;
  error: string | null;
  tasks: Task[];
};

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null
};

export const taskFeature = createFeature({
  name: 'tasks',
  reducer: createReducer(initialState,
    on(TasksActions.load, (state) => ({...state, loading: true, error: null})),
    on(TasksActions.loadSuccess, (state, {tasks}) =>
      ({...state, tasks, loading: false} )),
    on(TasksActions.loadFailure, (state, {error}) =>
      ({...state, error, loading: false})),
  )
});

export const {
  name: tasksfeatureKey,
  reducer: tasksreducer,
  selectTasks,
  selectLoading,
  selectError
} = taskFeature
