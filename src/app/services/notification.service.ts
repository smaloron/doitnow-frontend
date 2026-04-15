import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

export type NotificationLevel = 'info' | 'error' | 'success';

export interface Notification {
  message: string;
  level: NotificationLevel;
  id: number;
}

@Injectable({providedIn: 'root'})
export class NotificationService {

  private readonly subject = new Subject<Notification>();
  readonly notifications$: Observable<Notification> = this.subject.asObservable();
  private nextId: number = 0;

  private push(level: NotificationLevel = 'info', message: string): void {
    this.subject.next({
      id: ++this.nextId,
      level,
      message
    });
  }

  error(message: string): void {
    this.push('error', message);
  }

  success(message: string): void {
    this.push('success', message);
  }

  info(message: string): void {
    this.push('info', message);
  }

}
