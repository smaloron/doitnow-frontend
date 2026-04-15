// type union listant les valeurs littérales autorisées pour la priorité
// POURQUOI: TypeScript refusera à la compilation toute valeur hors liste,
// détectant les fautes de frappe avant même l'exécution
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// interface TypeScript décrivant la forme exacte d'une tâche
// POURQUOI: n'existe qu'à la compilation (zéro JavaScript généré), mais permet
// à l'éditeur et au compilateur de valider chaque accès à une propriété
export interface Task {
  id: string;                  // Identifiant unique fourni par l'API (UUID)
  title: string;               // Libellé obligatoire, jamais absent ni null
  description: string | null;  // "| null" : champ autorisé à être absent
  completed: boolean;          // false = à faire, true = terminée
  userId: string;              // Référence à l'utilisateur propriétaire
  priority: Priority;          // Limité aux 4 valeurs du type ci-dessus
  tags: string[];              // Tableau d'étiquettes, vide si aucune
  dueDate: string | null;      // Format YYYY-MM-DD, null si pas d'échéance
  createdAt: string;           // ISO 8601 ex : "2026-03-20T10:30:00"
  updatedAt: string;           // Mis à jour automatiquement à chaque modification
}

// DTO (Data Transfer Object) contenant uniquement les champs
// que l'utilisateur renseigne pour créer une tâche
// POURQUOI: "id", "createdAt" et "updatedAt" sont générés côté serveur —
// les inclure ici serait trompeur. Le "?" rend un champ optionnel :
// le service appliquera des valeurs par défaut pour les champs absents
export interface CreateTaskDTO {
  title: string;          // Seul champ obligatoire pour créer une tâche
  description?: string;   // Optionnel — absent = pas de description
  priority?: Priority;    // Optionnel — valeur par défaut : 'MEDIUM'
  tags?: string[];        // Optionnel — valeur par défaut : []
  dueDate?: string;       // Optionnel — la tâche peut n'avoir aucune échéance
}

// interface dédiée aux statistiques agrégées sur les tâches
// POURQUOI: séparée de Task pour ne pas mélanger les données brutes (issues
// de l'API) avec des valeurs calculées localement — responsabilités distinctes
export interface TaskStats {
  overdue: number;
  total: number;      // Nombre total de tâches dans la liste
  completed: number;  // Nombre de tâches dont completed === true
  pending: number;    // Nombre de tâches dont completed === false
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
  dueDate?: string;           // Format YYYY-MM-DD attendu par le backend
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
