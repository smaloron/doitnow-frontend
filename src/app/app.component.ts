import { Component } from '@angular/core';
import {
  HeaderComponent
} from './header/header.component';
import {
  FooterComponent
} from './footer/footer.component';
// Nouvel import — DashboardComponent ajouté pour la zone de contenu
import {
  DashboardComponent
} from './dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  // DashboardComponent ajouté au tableau imports
  // POURQUOI: Angular doit résoudre <app-dashboard> dans le template —
  // sans cet ajout, une erreur de compilation serait levée
  imports: [
    HeaderComponent,
    FooterComponent,
    DashboardComponent
  ]
})
export class AppComponent {
  title = 'doitnow-front';
}
