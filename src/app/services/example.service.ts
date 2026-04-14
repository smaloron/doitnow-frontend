// core/services/exemple.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {

  // Injection de HttpClient via la fonction inject()
  // POURQUOI: inject() est la syntaxe moderne d'Angular,
  // plus concise que l'injection par constructeur
  // et compatible avec les fonctions utilitaires hors classe
  private readonly http = inject(HttpClient);

  getData(): Observable<unknown> {
    return this.http.get('https://randomuser.me/api/?limit=5');
  }
}
