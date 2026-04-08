// header.component.ts
import { Component, inject } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  Router
} from '@angular/router';
import { AuthService } from
  '../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router      = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
