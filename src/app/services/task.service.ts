// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import {
  Task,
  CreateTaskDTO,
  Priority
} from '../models/task.model';

@Injectable({
  // Singleton — une instance unique partagée par toute l'application
  // POURQUOI: tous les composants qui affichent ou modifient des tâches lisent
  // la même source de données — sans cela, les affichages se désynchronisent
  providedIn: 'root'
})
export class TaskService {
  // tableau privé accessible uniquement via les méthodes publiques
  // POURQUOI: forcer le passage par getTasks(), createTask(), etc. donne au
  // service un contrôle total sur les mutations — les données sont temporaires
  // et seront remplacées par de vrais appels HTTP dans les modules suivants
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Rédiger le rapport Q3',
      description: 'Inclure les chiffres de vente et les KPI',
      completed: false,
      userId: 'user-1',
      priority: 'HIGH',
      tags: ['rapport', 'finance'],
      dueDate: '2026-04-03',
      createdAt: '2026-03-20T10:30:00',
      updatedAt: '2026-03-20T10:30:00'
    },
    {
      id: '2',
      title: 'Revoir la présentation client',
      description: null,
      completed: true,
      userId: 'user-1',
      priority: 'URGENT',
      tags: ['client', 'présentation'],
      dueDate: '2026-03-20',
      createdAt: '2026-03-15T09:00:00',
      updatedAt: '2026-03-20T14:00:00'
    },
    {
      id: '3',
      title: 'Apprendre Angular',
      description: 'Suivre la formation complète DoItNow',
      completed: false,
      userId: 'user-1',
      priority: 'MEDIUM',
      tags: ['formation', 'angular'],
      dueDate: '2026-04-15',
      createdAt: '2026-03-27T08:00:00',
      updatedAt: '2026-03-27T08:00:00'
    },
    {
      id: '4',
      title: 'Configurer CI/CD',
      description: 'Mettre en place GitHub Actions',
      completed: true,
      userId: 'user-1',
      priority: 'HIGH',
      tags: ['devops', 'github'],
      dueDate: null,
      createdAt: '2026-03-10T11:00:00',
      updatedAt: '2026-03-25T16:00:00'
    },
    {
      id: '5',
      title: 'Mettre à jour les dépendances npm',
      description: null,
      completed: false,
      userId: 'user-1',
      priority: 'LOW',
      tags: ['maintenance'],
      dueDate: '2026-03-01',  // date passée : tâche en retard
      createdAt: '2026-02-20T09:00:00',
      updatedAt: '2026-02-20T09:00:00'
    }
  ];

  // retourne une copie du tableau avec l'opérateur spread "[...]"
  // POURQUOI: sans cette précaution, un composant pourrait faire
  // tasks.push(tâcheInvalide) et corrompre l'état interne du service —
  // la copie protège l'encapsulation
  getTasks(): Task[] {
    return [...this.tasks];
  }

  // find() parcourt le tableau et retourne le premier élément
  // correspondant, ou undefined si aucun
  // POURQUOI: le type de retour "Task | undefined" force l'appelant à gérer
  // le cas "introuvable"
  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  // filter() retourne un nouveau tableau sans modifier l'original
  // POURQUOI: opération pure, sans effets de bord — l'état interne du
  // service reste intact
  getTasksByPriority(priority: Priority): Task[] {
    return this.tasks.filter(
      task => task.priority === priority
    );
  }

  // retourne les tâches non complètes dont la dueDate est passée
  getOverdueTasks(): Task[] {
    // extraction de la partie "date" de l'ISO 8601 via split('T')
    // POURQUOI: on obtient un format YYYY-MM-DD comparable directement aux
    // valeurs stockées dans dueDate
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(task =>
      // exclure les tâches déjà terminées
      !task.completed &&
      // exclure les tâches sans date d'échéance
      task.dueDate !== null &&
      // comparer les chaînes YYYY-MM-DD avec "<"
      // POURQUOI: ce format trie naturellement dans l'ordre chronologique
      task.dueDate < today
    );
  }

  // accepte un DTO plutôt que la liste complète des champs de Task
  // POURQUOI: plus lisible à l'appel et plus maintenable si les champs évoluent
  createTask(dto: CreateTaskDTO): Task {
    const newTask: Task = {
      // identifiant temporaire basé sur le timestamp en millisecondes
      // POURQUOI: suffisant côté client en dev — l'API fournira de vrais UUIDs
      id: Date.now().toString(),
      title: dto.title,
      // "??" (nullish coalescing) retourne la valeur de gauche si elle
      // n'est pas null ni undefined, sinon celle de droite
      description: dto.description ?? null,
      // une tâche nouvellement créée est toujours en attente
      completed: false,
      // valeur provisoire en dur
      userId: 'user-1',
      // priorité par défaut si non spécifiée par l'utilisateur
      priority: dto.priority ?? 'MEDIUM',
      tags: dto.tags ?? [],
      dueDate: dto.dueDate ?? null,
      // toISOString() produit une date au format ISO 8601 universel
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return newTask;
  }

  // réassignation avec un nouveau tableau filtré
  // POURQUOI: alternative écartée : splice() mute le tableau en place, ce qui
  // est moins sûr et moins compatible avec la détection de changements d'Angular
  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  // recherche de la tâche par ID avant modification
  // POURQUOI: le "if (task)" protège contre un ID invalide
  toggleComplete(id: string): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      // mise à jour de la date de dernière modification
      task.updatedAt = new Date().toISOString();
    }
  }
}
