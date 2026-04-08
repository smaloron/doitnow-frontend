// src/app/services/message.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  // instance unique partagée dans toute l'application (Singleton)
  // POURQUOI: si plusieurs composants lisent le message de bienvenue,
  // ils consultent la même source — cohérence garantie
  providedIn: 'root'
})
export class MessageService {
  // le message est encapsulé dans le service, pas en dur dans le composant
  // POURQUOI: si demain le message doit être personnalisé (utilisateur connecté,
  // traduction i18n, appel API), on ne modifie que cette méthode — tous les
  // composants consommateurs en bénéficient sans être touchés
  getWelcomeMessage(): string {
    return 'Bienvenue sur DoItNow !';
  }
}
