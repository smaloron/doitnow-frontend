import {Task} from '../models/task.model';
import {inject, Injectable} from '@angular/core';
import {AuthService} from '../auth/services/auth.service';
import {Observable, Subject} from 'rxjs';
import {Client} from '@stomp/stompjs';
import {environment} from '../../environments/environment';

export type TaskNotificationType = 'CREATED' | 'UPDATED' | 'DELETED';
export interface TaskNotification {
  type: TaskNotificationType;
  taskId: string;
  task: Task | null;
}

@Injectable({providedIn: 'root'})
export class TaskWebsocketService {
  private auth = inject(AuthService);

  private subject = new Subject<TaskNotification>();
  notifications$: Observable<TaskNotification> = this.subject.asObservable();

  private client?: Client;

  connect(): void {
    if(this.client?.active) return;

    const userId = this.auth.getUserId();
    const token = this.auth.getToken();

    if(!userId || ! token) return;

    this.client = new Client({
      brokerURL: environment.wsUrl,
      connectHeaders: {Authorization: `Bearer ${token}`},
      reconnectDelay: 5000,
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,
    });

    this.client.onConnect = ()=>{
      this.client?.subscribe(
        `/topic/tasks/${userId}`,
        (message: any) => {
          try {
            this.subject.next(JSON.parse(message.body) as TaskNotification);
          } catch (error) {
            console.log(error);
          }
        })
    };

    this.client.onStompError = (frame: any) => {
      console.error('Stomp error', frame.headers['message'], frame.body);
    }

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = undefined;
  }

}
