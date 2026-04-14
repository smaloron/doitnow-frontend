// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import {CreateTaskDTO, Task} from '../models/task.model';

@Injectable({
  // enregistre le service comme singleton au niveau racine de l'application
  // POURQUOI: providedIn 'root' permet le tree-shaking — si le service n'est jamais injecté, il est exclu du bundle
  providedIn: 'root'
})
export class TaskService {

  // données de démonstration reproduisant le jeu de données inséré par le backend
  // POURQUOI: permet de développer et tester les composants sans dépendre du backend
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Rédiger le rapport Q3',
      description: 'Consolider les indicateurs financiers'
        + ' et les présenter à la direction.',
      completed: false,
      userId: 'user-1',
      priority: 'HIGH',
      tags: ['rapport', 'finance'],
      dueDate: '2026-04-03',
      createdAt: '2026-03-20T09:00:00',
      updatedAt: '2026-03-20T09:00:00'
    },
    {
      id: '2',
      title: 'Corriger le bug #472',
      description: 'L\'écran de connexion plante sur Safari'
        + ' 17 en mode privé.',
      completed: false,
      userId: 'user-1',
      priority: 'URGENT',
      tags: ['bug', 'frontend'],
      dueDate: '2026-03-28',
      createdAt: '2026-03-25T14:30:00',
      updatedAt: '2026-03-25T14:30:00'
    },
    {
      id: '3',
      title: 'Revoir la documentation API',
      description: 'Mettre à jour les exemples Swagger'
        + ' suite à la migration vers Spring Boot 3.',
      completed: true,
      userId: 'user-1',
      priority: 'MEDIUM',
      tags: ['doc', 'api'],
      dueDate: '2026-03-22',
      createdAt: '2026-03-15T10:00:00',
      updatedAt: '2026-03-22T16:00:00'
    },
    {
      id: '4',
      title: 'Préparer la rétrospective',
      description: null,
      completed: false,
      userId: 'user-1',
      priority: 'LOW',
      tags: ['agile'],
      dueDate: '2026-04-10',
      createdAt: '2026-03-26T08:00:00',
      updatedAt: '2026-03-26T08:00:00'
    },
    {
      id: '5',
      title: 'Mettre à jour les dépendances npm',
      description: 'Vérifier les vulnérabilités et passer'
        + ' Angular en version 18.',
      completed: false,
      userId: 'user-1',
      priority: 'MEDIUM',
      tags: ['maintenance', 'angular'],
      dueDate: '2026-04-05',
      createdAt: '2026-03-24T11:00:00',
      updatedAt: '2026-03-24T11:00:00'
    },
    {
      id: '6',
      title: 'Rédiger les tests d\'intégration',
      description: 'Couvrir les endpoints /auth et /tasks'
        + ' avec Mockito et MockMvc.',
      completed: false,
      userId: 'user-1',
      priority: 'HIGH',
      tags: ['tests', 'backend'],
      // date volontairement dans le passé pour tester l'affichage "en retard"
      dueDate: '2026-03-15',
      createdAt: '2026-03-10T09:30:00',
      updatedAt: '2026-03-10T09:30:00'
    },
    {
      id: '7',
      title: 'Configurer le pipeline CI/CD',
      description: 'Mettre en place GitHub Actions pour'
        + ' les builds et les déploiements automatisés.',
      completed: true,
      userId: 'user-1',
      priority: 'HIGH',
      tags: ['devops', 'ci-cd'],
      dueDate: '2026-03-20',
      createdAt: '2026-03-12T14:00:00',
      updatedAt: '2026-03-20T18:00:00'
    },
    {
      id: '8',
      title: 'Organiser le kick-off du projet Bêta',
      description: null,
      completed: false,
      userId: 'user-1',
      priority: 'URGENT',
      tags: ['management'],
      dueDate: '2026-03-29',
      createdAt: '2026-03-27T07:00:00',
      updatedAt: '2026-03-27T07:00:00'
    }
  ];

  // renvoie une copie shallow du tableau de tâches
  // POURQUOI: le spread [...] crée une nouvelle référence — les composants ne peuvent pas muter le tableau interne
  getTasks(): Task[] {
    return [...this.tasks];
  }

  getOneById(id:string | null): Task  {
    let task = this.tasks.find((task) => task.id === id);
    if (!task) {
      return {
        id: '1',
        title: 'Pas de tâche',
        description: 'Consolider les indicateurs financiers'
          + ' et les présenter à la direction.',
        completed: false,
        userId: 'user-1',
        priority: 'HIGH',
        tags: ['rapport', 'finance'],
        dueDate: '2026-04-03',
        createdAt: '2026-03-20T09:00:00',
        updatedAt: '2026-03-20T09:00:00'
      };
    }

    return task;
  }

  // inverse le booléen completed de la tâche identifiée par son id
  // POURQUOI: la mutation se fait dans le service (source de vérité unique)
  toggleComplete(id: string): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
    }
  }

  // supprime une tâche du tableau en créant un nouveau tableau filtré
  // POURQUOI: filter() produit un nouveau tableau plutôt que muter l'existant avec splice
  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  saveTask(data: CreateTaskDTO): void {

  }
}
