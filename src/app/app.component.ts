// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from
  './header/header.component';
import { FooterComponent } from
  './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // imports des composants et directives utilisés dans le template
  // POURQUOI: en mode standalone, chaque composant déclare explicitement ses dépendances
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly title = 'DoItNow';
}
