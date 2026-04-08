// relative-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeDate',
  standalone: true,
})
export class RelativeDatePipe implements PipeTransform {

  /**
   * Transforme une date ISO en durée relative.
   * Valeurs possibles :
   * "Sans échéance", "Hier", "Aujourd'hui",
   * "Demain", "Dans N jours", "Il y a N jours",
   * "Dans 1 semaine", "Dans X semaines", "Il y a plus d'un mois"
   */
  transform(value: string | null | undefined): string {
    // Court-circuit si la valeur est absente (null ou undefined)
    // POURQUOI: new Date(undefined) crée une "Invalid Date" — on sort immédiatement
    if (!value) {
      return 'Sans échéance';
    }

    // Normalise les deux dates à minuit pour comparer uniquement les jours
    // POURQUOI: Sans cette normalisation, une tâche due aujourd'hui à 8h serait
    // "en retard" si le code s'exécute à 9h
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(value);
    target.setHours(0, 0, 0, 0);

    // Calcule la différence en jours (positive = futur, négative = passé)
    // POURQUOI: getTime() retourne des ms depuis epoch, la division par 86400000
    // (ms/jour) donne un nombre de jours
    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.round(
      diffMs / (1000 * 60 * 60 * 24)
    );

    // Cas proches traités en premier (aujourd'hui, demain, hier)
    // POURQUOI: Ces cas spécifiques doivent précéder les blocs "semaines"
    if (diffDays === 0)  return "Aujourd'hui";
    if (diffDays === 1)  return 'Demain';
    if (diffDays === -1) return 'Hier';

    // Cas spécial pour exactement 7 jours
    if (diffDays === 7) {
      return 'Dans 1 semaine';
    }
    if (diffDays > 1 && diffDays <= 30) {
      // Math.round arrondit au nombre de semaines le plus proche
      const weeks = Math.round(diffDays / 7);
      if (weeks >= 2) {
        return `Dans ${weeks} semaines`;
      }
      // Si weeks vaut 1 mais diffDays n'est pas 7, on affiche en jours
      // POURQUOI: "Dans 5 jours" est plus précis que "Dans 1 semaine" pour 5 jours
      return `Dans ${diffDays} jours`;
    }

    // Passé lointain (plus de 30 jours)
    if (diffDays < -30) {
      return "Il y a plus d'un mois";
    }

    // Passé récent (entre -2 et -30 jours)
    if (diffDays < -1) {
      return `Il y a ${Math.abs(diffDays)} jours`;
    }

    // Futur lointain (> 30 jours) — dernier cas restant
    return `Dans ${diffDays} jours`;
  }
}
