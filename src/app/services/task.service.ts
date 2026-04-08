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
  // Méthode privée calculant une date relative à aujourd'hui (positif = futur, négatif = passé)
  // POURQUOI: Utilitaire interne pour générer les données de test
  private daysFromNow(days: number): string {
    const d = new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    );
    // split('T')[0] extrait la partie date "2026-03-30" de la chaîne ISO complète
    return d.toISOString().split('T')[0];
  }

  // tableau privé accessible uniquement via les méthodes publiques
  // POURQUOI: forcer le passage par getTasks(), createTask(), etc. donne au
  // service un contrôle total sur les mutations
  private tasks: Task[] = [
    {
      id: '1',
      title: 'rédiger le rapport trimestriel',
      description: 'Inclure les indicateurs Q1.',
      completed: false,
      userId: 'u1',
      priority: 'HIGH',
      tags: ['rapport', 'finance'],
      dueDate: this.daysFromNow(3),
      createdAt: '2026-03-20T09:00:00',
      updatedAt: '2026-03-20T09:00:00',
    },
    {
      id: '2',
      title: 'corriger les tests unitaires',
      description: null,
      completed: true,
      userId: 'u1',
      priority: 'MEDIUM',
      tags: ['dev', 'qualité'],
      dueDate: this.daysFromNow(-5),
      createdAt: '2026-03-15T14:00:00',
      updatedAt: '2026-03-26T10:00:00',
    },
    {
      id: '3',
      title: 'réunion de sprint',
      description: 'Préparer le point avancement.',
      completed: false,
      userId: 'u1',
      priority: 'URGENT',
      tags: ['réunion'],
      dueDate: this.daysFromNow(-2),  // En retard ET non terminée → badge rouge
      createdAt: '2026-03-27T08:00:00',
      updatedAt: '2026-03-27T08:00:00',
    },
    {
      id: '4',
      title: 'veille technologique',
      description: null,
      completed: false,
      userId: 'u1',
      priority: 'LOW',
      tags: [],
      dueDate: null,  // Pas d'échéance → badge "Sans échéance"
      createdAt: '2026-03-10T11:00:00',
      updatedAt: '2026-03-10T11:00:00',
    },
    {
      id: '5',
      title: 'configurer CI/CD',
      description: 'Mettre en place GitHub Actions',
      completed: true,
      userId: 'u1',
      priority: 'HIGH',
      tags: ['devops', 'github'],
      dueDate: null,
      createdAt: '2026-03-10T11:00:00',
      updatedAt: '2026-03-25T16:00:00',
    },
  ];

  // retourne une copie du tableau avec l'opérateur spread "[...]"
  // POURQUOI: sans cette précaution, un composant pourrait corrompre l'état interne
  getTasks(): Task[] {
    return [...this.tasks];
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  getTasksByPriority(priority: Priority): Task[] {
    return this.tasks.filter(
      task => task.priority === priority
    );
  }

  getOverdueTasks(): Task[] {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter(task =>
      !task.completed &&
      task.dueDate !== null &&
      task.dueDate < today
    );
  }

  createTask(dto: CreateTaskDTO): Task {
    const newTask: Task = {
      id: Date.now().toString(),
      title: dto.title,
      description: dto.description ?? null,
      completed: false,
      userId: 'user-1',
      priority: dto.priority ?? 'MEDIUM',
      tags: dto.tags ?? [],
      dueDate: dto.dueDate ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return newTask;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  toggleComplete(id: string): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      task.updatedAt = new Date().toISOString();
    }
  }
}
