// relative-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate',
  standalone: true
})
export class RelativeDatePipe implements PipeTransform {

  // transforme une chaîne YYYY-MM-DD en libellé relatif ("Dans 3 jours", "Hier", etc.)
  // POURQUOI: un pipe plutôt qu'une méthode dans le composant — réutilisable dans n'importe quel template
  transform(value: string | null): string {
    if (!value) {
      return 'Pas de date d\'échéance';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(value);
    target.setHours(0, 0, 0, 0);

    // calcul de la différence en jours entiers entre la date cible et aujourd'hui
    // POURQUOI: Math.round plutôt que Math.floor — compense les erreurs de ms dues au DST
    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Aujourd\'hui';
    }
    if (diffDays === 1) {
      return 'Demain';
    }
    if (diffDays === -1) {
      return 'Hier';
    }
    if (diffDays > 1) {
      return `Dans ${diffDays} jours`;
    }
    // diffDays < -1 signifie une date passée de plus d'un jour
    return `Il y a ${Math.abs(diffDays)} jours`;
  }
}
