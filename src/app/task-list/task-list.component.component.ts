import { Component } from '@angular/core';
import {
  TagBadgeComponent
} from '../tag-badge/tag-badge-component';

@Component({
  selector: 'app-tag-list',
  // Tags passés en attributs statiques (sans crochets) car ce sont des chaînes littérales
  // POURQUOI: (removed)="onTagRemoved($event)" écoute l'événement de chaque badge —
  // dans la partie 1.5, ce code sera simplifié avec la directive @for
  template: `
    <div class="tag-list">
      <app-tag-badge
        tag="angular"
        (removed)="onTagRemoved($event)">
      </app-tag-badge>
      <app-tag-badge
        tag="typescript"
        (removed)="onTagRemoved($event)">
      </app-tag-badge>
      <app-tag-badge
        tag="formation"
        (removed)="onTagRemoved($event)">
      </app-tag-badge>
    </div>
  `,
  styles: [`
    .tag-list {
      display: flex;
      gap: 0.5rem;
      /* flex-wrap permet aux badges de passer à la ligne si nécessaire */
      /* POURQUOI: Évite un débordement horizontal quand l'espace est insuffisant */
      flex-wrap: wrap;
    }
  `],
  standalone: true,
  // TagBadgeComponent listé pour qu'Angular reconnaisse <app-tag-badge>
  imports: [TagBadgeComponent]
})
export class TagListComponent {
  // Source de vérité des tags, centralisée dans le composant parent
  // POURQUOI: Principe du "unidirectional data flow" — les données descendent du parent
  // vers les enfants, les événements remontent dans l'autre sens
  tags = ['angular', 'typescript', 'formation'];

  // Reçoit le tag supprimé ($event) et décide quoi en faire
  // POURQUOI: Le composant parent est le "chef d'orchestre" — dans une vraie application,
  // on filtrerait le tableau tags pour retirer l'élément supprimé
  onTagRemoved(tag: string): void {
    console.log('Tag supprimé :', tag);
  }
}
