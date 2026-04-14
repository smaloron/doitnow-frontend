// Import du trio Input/Output/EventEmitter pour la communication bidirectionnelle
// POURQUOI: Kit de base de tout composant qui reçoit des données et émet des événements
import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-tag-badge',
  // Bouton "x" avec event binding pour signaler la suppression au parent
  // POURQUOI: Ce composant n'a pas accès à la liste des tags — il ne peut que signaler qu'il doit être supprimé
  template: `
    <span class="tag-badge">
      {{ tag }}
      <button
        class="tag-remove"
        (click)="onRemove()">
        x
      </button>
    </span>
  `,
  styles: [`
    .tag-badge {
      /* inline-flex aligne le texte du tag et le bouton "x" sur la même ligne */
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      background-color: #e8f0fe;
      color: #1a73e8;
      /* border-radius élevé (16px) pour la forme "pilule" caractéristique des badges */
      border-radius: 16px;
      font-size: 0.8rem;
    }
    .tag-remove {
      /* Suppression de l'apparence par défaut du bouton HTML */
      /* POURQUOI: Le bouton doit ressembler à un simple "x", pas à un bouton classique */
      background: none;
      border: none;
      color: #1a73e8;
      cursor: pointer;
      font-size: 0.8rem;
      padding: 0 0.2rem;
      line-height: 1;
    }
    .tag-remove:hover {
      /* Passage en rouge au survol */
      /* POURQUOI: Signale visuellement que c'est une action destructrice */
      color: #d93025;
    }
  `],
  standalone: true
})
export class TagBadgeComponent {
  // Tag à afficher, fourni par le parent via @Input()
  @Input() tag = '';
  // EventEmitter<string> transportant la valeur du tag supprimé
  // POURQUOI: Transmettre le tag (et non un index) est plus robuste — les index changent
  // quand on supprime des éléments, mais la valeur du tag reste stable
  @Output() removed = new EventEmitter<string>();

  // Émet le tag vers le parent pour signaler la suppression
  // POURQUOI: Ce composant ne modifie aucune donnée lui-même — respecter ce principe
  // le rend réutilisable dans n'importe quel contexte
  onRemove(): void {
    this.removed.emit(this.tag);
  }
}
