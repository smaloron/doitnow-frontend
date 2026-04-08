import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  template: `
    <h2>Détail de la tâche</h2>
    <p>Identifiant : <strong>{{ taskId }}</strong></p>
    <button type="button" (click)="goBack()">
      Retour à la liste
    </button>
  `
})
export class TaskDetailComponent implements OnInit {
  taskId = '';

  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    // Récupère le paramètre :id depuis l'URL via le snapshot
    // POURQUOI: snapshot.paramMap donne la valeur au moment du chargement —
    // suffisant ici car on ne change pas d'ID sans changer de route
    this.taskId =
      this.route.snapshot.paramMap.get('id') ?? '';
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
