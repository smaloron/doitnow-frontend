import {Component, inject, OnInit} from '@angular/core';
import { Task} from '../models/task.model';
import {TaskService} from '../services/task.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-task-details-component',
  imports: [],
  templateUrl: './task-details-component.html',
  styleUrl: './task-details-component.css',
})
export class TaskDetailsComponent implements OnInit {

  task!: Task;
  private taskService: TaskService = inject(TaskService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.task = this.taskService.getOneById(id);
  }

}
