// Import du trio Input/Output/EventEmitter pour la communication inter-composants
import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
// Import de l'interface Task pour le typage fort
// POURQUOI: Garantit que ce composant ne peut recevoir qu'un objet conforme au modèle Task —
// TypeScript signalera toute propriété manquante ou mal typée
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css',
  standalone: true
})
export class TaskCardComponent {
  // @Input() avec "!" (definite assignment assertion) — le parent DOIT fournir une tâche
  // POURQUOI: Le "!" dit à TypeScript "cette propriété sera initialisée via @Input avant usage" —
  // sans lui, TypeScript refuserait la compilation. C'est un compromis : on accepte la responsabilité
  // de s'assurer que le parent fournit toujours cette valeur
  @Input() task!: Task;

  // Deux @Output distincts pour émettre des événements vers le parent
  // POURQUOI: Nommés au passé ('deleted', 'toggled') par convention Angular —
  // indique que l'action a eu lieu côté enfant et que le parent doit y réagir.
  // EventEmitter<string> transmet l'identifiant de la tâche
  @Output() deleted =
    new EventEmitter<string>();
  @Output() toggled =
    new EventEmitter<string>();

  /**
   * Retourne une description lisible de la priorité en français.
   */
  getPriorityLabel(): string {
    // Dictionnaire Record qui mappe chaque priorité vers un libellé français
    // POURQUOI: Plus concis et extensible qu'un switch/case — pour ajouter une priorité,
    // il suffit d'ajouter une entrée dans l'objet
    const labels: Record<string, string> = {
      LOW: 'Faible',
      MEDIUM: 'Normale',
      HIGH: 'Haute',
      URGENT: 'Urgente',
    };
    // Fallback avec ?? si la priorité n'est pas dans le dictionnaire
    // POURQUOI: Sécurité défensive — si l'API renvoie une nouvelle priorité pas encore
    // mappée, on affiche la valeur brute plutôt que "undefined"
    return labels[this.task.priority] ?? this.task.priority;
  }

  /**
   * Retourne un libellé lisible pour le nombre de tags.
   */
  getTagsLabel(): string {
    // Extraction de la longueur dans une constante locale
    // POURQUOI: Évite de répéter this.task.tags.length et améliore la lisibilité
    const count = this.task.tags.length;

    // Trois cas distincts plutôt qu'un ternaire imbriqué
    // POURQUOI: Les ternaires imbriqués (a ? b : c ? d : e) deviennent
    // rapidement illisibles — des if séparés sont plus clairs pour 3+ cas
    if (count === 0) {
      return 'Aucun tag';
    }

    if (count === 1) {
      // Accord grammatical singulier
      return '1 tag';
    }

    // Template literal pour insérer la variable dans la chaîne
    // POURQUOI: Plus lisible que la concaténation avec + (ex: count + ' tags')
    return `${count} tags`;
  }

  /**
   * Retourne la classe CSS correspondant au niveau de priorité.
   */
  getPriorityClass(): string {
    // Génération dynamique du nom de classe CSS via toLowerCase()
    // POURQUOI: La convention "priority-" + valeur en minuscule correspond aux classes
    // CSS (.priority-high, etc.) — cela évite un mapping manuel et reste extensible :
    // ajouter une priorité ne nécessite qu'une nouvelle classe CSS
    return `priority-${this.task.priority.toLowerCase()}`;
  }

  /**
   * Détermine si la tâche est en retard.
   * Une tâche est en retard si elle n'est pas terminée
   * et que sa date d'échéance est passée.
   */
  isOverdue(): boolean {
    // Early return si pas de date d'échéance
    // POURQUOI: Évite de continuer avec une valeur null qui provoquerait
    // une erreur à la construction de new Date(null)
    if (!this.task.dueDate) {
      return false;
    }

    // Early return si la tâche est déjà terminée
    // POURQUOI: La règle métier prime — une tâche terminée n'est jamais "en retard",
    // même si sa date d'échéance est passée
    if (this.task.completed) {
      return false;
    }

    const today = new Date();
    // Remise de l'heure à minuit (00:00:00.000)
    // POURQUOI: Sans ça, une tâche dont l'échéance est aujourd'hui à 9h00
    // serait considérée en retard si on la consulte à 10h00 — on compare
    // uniquement les jours, pas les heures
    today.setHours(0, 0, 0, 0);

    // Construction d'un objet Date depuis la chaîne YYYY-MM-DD
    const dueDate = new Date(this.task.dueDate);

    // Comparaison stricte : en retard si l'échéance est avant aujourd'hui
    return dueDate < today;
  }

  /**
   * Bascule l'état de complétion de la tâche.
   */
  toggleCompleted(): void {
    // Inversion du booléen avec l'opérateur NOT (!)
    // POURQUOI: Moyen le plus concis d'alterner entre deux états —
    // pas besoin d'un if/else pour assigner true ou false
    this.task.completed = !this.task.completed;
  }

  /**
   * Capture la valeur saisie dans un champ de texte.
   * @param event - L'événement DOM natif
   */
  onTitleInput(event: Event): void {
    // Cast explicite de event.target vers HTMLInputElement
    // POURQUOI: TypeScript ne sait pas quel type d'élément a déclenché l'événement —
    // le cast débloque l'autocomplétion et la vérification de .value par le compilateur
    const input = event.target as HTMLInputElement;
    console.log('Valeur saisie :', input.value);
  }

  // Émet l'id de la tâche vers le parent au clic sur "Supprimer"
  // POURQUOI: Ce composant n'effectue aucune suppression lui-même — il délègue au parent
  // qui décide comment réagir (appel API, mise à jour de la liste, etc.)
  /**
   * Demande la suppression de la tâche.
   * Affiche une confirmation dans la console.
   */
  onDelete(event: Event): void {
    // stopPropagation() placé en premier dans la méthode
    // POURQUOI: En cas d'erreur dans le code suivant, la propagation est quand même
    // arrêtée — bonne pratique de placer les effets défensifs avant la logique métier
    event.stopPropagation();

    console.log(
      'Suppression demandée pour :',
      this.task.title
    );
    this.deleted.emit(this.task.id);
  }

  // Émet l'id de la tâche pour basculer l'état "terminée / non terminée"
  // POURQUOI: L'enfant n'a pas accès à la liste complète des tâches —
  // il délègue la mise à jour au parent qui possède l'état global
  onToggleComplete(): void {
    this.toggled.emit(this.task.id);
  }

  getDueDateLabel(): string {
    // Early return si dueDate est null ou vide (falsy)
    // POURQUOI: Sortir tôt évite l'imbrication de if/else et rend le flux
    // plus lisible — l'opérateur ! couvre à la fois null et chaîne vide
    if (!this.task.dueDate) {
      return 'Sans échéance';
    }
    return 'Échéance : ' + this.task.dueDate;
  }
}
