// footer.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  // année courante calculée une seule fois à l'instanciation
  readonly currentYear = new Date().getFullYear();
}
