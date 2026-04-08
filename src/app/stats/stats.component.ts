import { Component } from '@angular/core';
import { StatsFilterFormComponent } from
  './stats-filter-form/stats-filter-form.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [StatsFilterFormComponent],
  template: `
    <h1>Statistiques</h1>
    <app-stats-filter-form />
    <p>Tableau de bord statistiques à venir.</p>
  `
})
export class StatsComponent {}
