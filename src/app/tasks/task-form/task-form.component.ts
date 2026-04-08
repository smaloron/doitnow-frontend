import { Component, inject, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CreateTaskDTO } from '../../models/task.model';
import {
  futureDateValidator
} from '../../validators/custom-validators';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  taskId: string | null = null;
  isLoading = false;
  // Stocke les erreurs de validation retournées par le backend (HTTP 400)
  // POURQUOI: permet d'afficher les messages API en regard de chaque champ du formulaire
  apiErrors: Record<string, string> = {};

  readonly priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

  taskForm = this.fb.group({
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]
    ],
    description: ['', Validators.maxLength(500)],
    priority: ['MEDIUM', Validators.required],
    tags: this.fb.array([]),
    dueDate: ['', futureDateValidator()]
  });

  // Accesseur qui caste le contrôle 'tags' en FormArray
  // POURQUOI: taskForm.get('tags') retourne AbstractControl | null ; le cast est nécessaire
  get tags(): FormArray {
    return this.taskForm.get('tags') as FormArray;
  }

  get title() { return this.taskForm.get('title'); }
  get description() {
    return this.taskForm.get('description');
  }
  get dueDate() { return this.taskForm.get('dueDate'); }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.taskId;

    if (this.isEditMode && this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  private loadTask(id: string): void {
    this.taskService.getTaskById(id).subscribe({
      next: (task) => {
        // Vider le FormArray avant de le repeupler
        // POURQUOI: sans clear(), un double appel dupliquerait les tags
        this.tags.clear();
        task.tags.forEach(tag => this.addTag(tag));

        this.taskForm.patchValue({
          title: task.title,
          description: task.description ?? '',
          priority: task.priority,
          dueDate: task.dueDate ?? ''
        });
      },
      error: () => this.router.navigate(['/tasks'])
    });
  }

  addTag(value = ''): void {
    this.tags.push(
      this.fb.control(value, Validators.required)
    );
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  onSubmit(): void {
    if (this.taskForm.invalid) return;

    this.isLoading = true;
    this.apiErrors = {};

    const v = this.taskForm.value;
    const dto: CreateTaskDTO = {
      title: v.title!,
      description: v.description || undefined,
      priority: v.priority as any,
      tags: (v.tags as string[]).filter(t => t.trim()),
      dueDate: v.dueDate || undefined
    };

    const request$ = this.isEditMode && this.taskId
      ? this.taskService.updateTask(this.taskId, {
          ...dto, completed: false
        })
      : this.taskService.createTask(dto);

    request$.subscribe({
      next: (task) => {
        this.router.navigate(['/tasks', task.id]);
      },
      error: (err) => {
        this.isLoading = false;
        // Récupère l'objet d'erreurs de validation renvoyé par le backend (clé = nom du champ)
        // POURQUOI: afficher les erreurs API en regard de chaque champ offre une meilleure UX
        if (err.status === 400) {
          this.apiErrors = err.error;
        }
      }
    });
  }
}
