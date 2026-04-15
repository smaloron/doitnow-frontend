// home.component.ts
import {Component, inject, OnInit} from '@angular/core';
import { TaskListComponent } from
        '../../task-list/task-list.component';
import {HttpClient} from '@angular/common/http';
import {ExampleService} from '../../../services/example.service';
import {SidebarComponent} from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TaskListComponent, SidebarComponent],
  template: `
    <div class="container">
      <app-sidebar/>
      <app-task-list />
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }`
  ]
})
export class HomeComponent implements OnInit {

    private service = inject(ExampleService);

    ngOnInit(): void {

    }

}
