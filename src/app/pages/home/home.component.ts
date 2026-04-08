// home.component.ts
import { Component } from '@angular/core';
import { TaskListComponent } from
  '../../task-list/task-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TaskListComponent],
  template: '<app-task-list />'
})
export class HomeComponent {}
