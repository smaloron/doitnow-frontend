// src/app/task-list/task-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskStats } from '../models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  // FormsModule requis pour [(ngModel)]
  // POURQUOI: Sans cet import, Angular lève l'erreur "Can't bind to 'ngModel'"
  imports: [FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {

  // le composant ne contient plus aucune donnée en dur —
  // TaskService est la seule source de vérité
  // POURQUOI: "private" car le template passe par les propriétés publiques
  // "tasks" et "stats" — il n'accède pas au service directement
  private taskService = inject(TaskService);

  // Propriété liée au champ de recherche via [(ngModel)]
  // POURQUOI: Initialisée à '' pour éviter les erreurs sur .length ou .includes()
  // avant toute saisie utilisateur
  searchKeyword: string = '';

  // Union type restreignant filterStatus à trois valeurs exactes
  // POURQUOI: TypeScript refuse toute autre valeur à la compilation — protège
  // des fautes de frappe et rend les états possibles explicites
  filterStatus: 'all' | 'pending' | 'completed' = 'all';

  // tableau public itérable par @for dans le template
  // POURQUOI: initialisé à [] pour éviter toute erreur avant ngOnInit()
  tasks: Task[] = [];

  // objet public lisible par le template via {{ stats.total }}, etc.
  // POURQUOI: initialisé à zéro car le template peut être évalué avant ngOnInit()
  stats: TaskStats = {
    total: 0,
    completed: 0,
    pending: 0
  };

  ngOnInit(): void {
    // chargement des tâches une seule fois au démarrage
    // POURQUOI: getTasks() retourne une copie — this.tasks est indépendant
    // du tableau interne du service
    this.tasks = this.taskService.getTasks();
    this.updateStats();
  }

  /**
   * Bascule l'état de complétion d'une tâche.
   */
  toggleCompleted(task: Task): void {
    // Modification via le service pour garder la cohérence
    this.taskService.toggleComplete(task.id);
    // Recharger les tâches depuis le service
    this.tasks = this.taskService.getTasks();
    this.updateStats();
  }

  /**
   * Retourne la classe CSS pour le badge de priorité.
   */
  getPriorityClass(task: Task): string {
    return `priority-${task.priority.toLowerCase()}`;
  }

  /**
   * Retourne le libellé français de la priorité.
   */
  getPriorityLabel(task: Task): string {
    const labels: Record<string, string> = {
      LOW: 'Faible',
      MEDIUM: 'Normale',
      HIGH: 'Haute',
      URGENT: 'Urgente',
    };
    return labels[task.priority] ?? task.priority;
  }

  /**
   * Retourne le nombre de tâches non terminées.
   */
  getPendingCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  /**
   * Retourne le nombre de tâches correspondant au filtre actif.
   */
  getFilteredCount(): number {
    switch (this.filterStatus) {
      case 'pending':
        return this.tasks.filter(t => !t.completed).length;
      case 'completed':
        return this.tasks.filter(t => t.completed).length;
      default:
        return this.tasks.length;
    }
  }

  /**
   * Réinitialise le champ de recherche.
   */
  clearSearch(): void {
    this.searchKeyword = '';
  }

  /**
   * Met à jour les statistiques à partir du tableau local.
   */
  private updateStats(): void {
    this.stats = {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.completed).length,
      pending: this.tasks.filter(t => !t.completed).length
    };
  }
}
