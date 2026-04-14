// home.component.ts
import {Component, inject, OnInit} from '@angular/core';
import { TaskListComponent } from
        '../../task-list/task-list.component';
import {HttpClient} from '@angular/common/http';
import {ExampleService} from '../../../services/example.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TaskListComponent],
  template: '<app-task-list />'
})
export class HomeComponent implements OnInit {

    private service = inject(ExampleService);

    ngOnInit(): void {

    }

}
