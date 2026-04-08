// Type union — Priority ne peut prendre que l'une de ces quatre valeurs
// POURQUOI: Empêche de passer accidentellement une chaîne invalide comme 'CRITICAL' ou 'low' —
// TypeScript signale toute valeur non reconnue à la compilation, avant l'exécution
export type Priority =
  'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// Interface définissant la "forme" d'un objet Task (contrat de données partagé)
// POURQUOI: Elle n'existe qu'à la compilation (disparaît dans le JavaScript final) mais garantit
// que tous les composants et services utilisent la même structure pour représenter une tâche
export interface Task {
  id: string;
  title: string;
  // "| null" indique que la description est optionnelle
  // POURQUOI: Plus précis qu'une string vide "" — distingue "l'utilisateur a laissé vide"
  // de "ce champ n'existe pas"
  description: string | null;
  completed: boolean;
  userId: string;
  // Réutilisation du type Priority défini au-dessus
  // POURQUOI: Garantit que seules les valeurs valides peuvent être assignées
  priority: Priority;
  // Tableau de chaînes pour les labels des tags
  tags: string[];
  // Dates stockées comme chaînes ISO 8601 (ex: "2026-04-15")
  // POURQUOI: JSON ne connaît pas le type Date natif — toutes les dates transitent
  // via l'API sous forme de texte
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
