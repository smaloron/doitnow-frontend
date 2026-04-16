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
    on(TasksActions.taskCreated,
      (state, {task}) =>{
        const found = state.tasks.some(t => t.id === task.id);
        return found ? state : {...state, tasks:[task, ...state.tasks ]};
    }),
    on(TasksActions.taskUpdated, (state, {task}) =>{
      return ({...state, tasks: state.tasks.map(t => t.id === task.id ? task : t) });
    }),
    on(TasksActions.taskDeleted, (state, {taskId}) => {
      return ({...state, tasks: state.tasks.filter(t => t.id !== taskId) });
    })
  )
});

export const {
  name: tasksfeatureKey,
  reducer: tasksreducer,
  selectTasks,
  selectLoading,
  selectError
} = taskFeature
