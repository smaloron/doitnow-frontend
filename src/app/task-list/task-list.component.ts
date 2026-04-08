// src/app/task-list/task-list.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  // FormsModule requis pour [(ngModel)]
  // POURQUOI: Sans cet import, Angular lève l'erreur "Can't bind to 'ngModel'"
  imports: [FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {

  // Propriété liée au champ de recherche via [(ngModel)]
  // POURQUOI: Initialisée à '' pour éviter les erreurs sur .length ou .includes()
  // avant toute saisie utilisateur
  searchKeyword: string = '';

  // Union type restreignant filterStatus à trois valeurs exactes
  // POURQUOI: TypeScript refuse toute autre valeur à la compilation — protège
  // des fautes de frappe et rend les états possibles explicites
  filterStatus: 'all' | 'pending' | 'completed' = 'all';

  // Données statiques en dur (backend non connecté)
  // POURQUOI: Permet de tester l'interface sans dépendance externe — sera remplacé
  // par un appel au TaskService injectable (partie 1.4)
  tasks: Task[] = [
    {
      id: '1',
      title: 'Rédiger le rapport Q3',
      description: 'Inclure les chiffres de ventes',
      completed: false,
      userId: 'user-1',
      priority: 'HIGH',
      tags: ['rapport', 'finance'],
      dueDate: '2026-04-03',
      createdAt: '2026-03-27T10:30:00',
      updatedAt: '2026-03-27T10:30:00',
    },
    {
      id: '2',
      title: 'Préparer la réunion client',
      description: null,
      completed: true,
      userId: 'user-1',
      priority: 'URGENT',
      tags: ['réunion'],
      dueDate: null,
      createdAt: '2026-03-26T09:00:00',
      updatedAt: '2026-03-27T08:00:00',
    },
    {
      id: '3',
      title: 'Apprendre Angular',
      description: 'Suivre la formation DoItNow',
      completed: false,
      userId: 'user-1',
      priority: 'MEDIUM',
      tags: ['formation', 'angular'],
      dueDate: '2026-04-15',
      createdAt: '2026-03-25T14:00:00',
      updatedAt: '2026-03-25T14:00:00',
    },
  ];

  /**
   * Bascule l'état de complétion d'une tâche.
   */
  toggleCompleted(task: Task): void {
    // Modification directe de la propriété de l'objet reçu par référence
    // POURQUOI: tasks[] contient des références — la modification est reflétée
    // dans le tableau et Angular détecte le changement automatiquement
    task.completed = !task.completed;
  }

  /**
   * Retourne la classe CSS pour le badge de priorité.
   */
  getPriorityClass(task: Task): string {
    // Génération dynamique du nom de classe CSS
    // POURQUOI: toLowerCase() convertit 'HIGH' en 'high' pour correspondre aux classes
    // CSS (.priority-high) — la cohérence entre TypeScript et CSS est indispensable
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
    // Fallback avec ?? pour les priorités non mappées
    // POURQUOI: Si l'API ajoute une nouvelle priorité pas encore dans le dictionnaire,
    // on affiche la valeur brute plutôt que "undefined"
    return labels[task.priority] ?? task.priority;
  }

  /**
   * Retourne le nombre de tâches non terminées.
   */
  getPendingCount(): number {
    // Filtre les tâches non terminées et retourne leur nombre
    // POURQUOI: Appelée à chaque cycle de détection Angular — le compteur reste
    // toujours synchronisé avec l'état réel après chaque toggleCompleted()
    return this.tasks.filter(t => !t.completed).length;
  }

  /**
   * Retourne le nombre de tâches correspondant au filtre actif.
   */
  getFilteredCount(): number {
    switch (this.filterStatus) {
      case 'pending':
        // filter() crée un nouveau tableau des tâches non terminées
        return this.tasks.filter(t => !t.completed).length;
      case 'completed':
        return this.tasks.filter(t => t.completed).length;
      default:
        // Cas 'all' — pas de filtrage, on retourne le total
        return this.tasks.length;
    }
  }

  /**
   * Réinitialise le champ de recherche.
   */
  clearSearch(): void {
    // Réinitialisation de searchKeyword à chaîne vide
    // POURQUOI: Grâce au two-way binding, le champ HTML se vide instantanément
    // sans manipulation DOM — le composant pilote l'UI, pas l'inverse
    this.searchKeyword = '';
  }
}
