// src/app/header/header.component.ts
import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // nom de l'application affiché dans la barre de navigation
  // POURQUOI: readonly car cette valeur ne changera jamais
  readonly appName = 'DoItNow';
  protected authService = inject(AuthService);
}
