import {Component, inject, OnInit, signal, DestroyRef} from '@angular/core';
import {NotificationService, Notification} from '../../services/notification.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

const NOTIFICATION_DELAY = 5000;

@Component({
  selector: 'app-notification-component',
  imports: [],
  templateUrl: './notification-component.html',
  styleUrl: './notification-component.css',
})
export class NotificationComponent implements OnInit {

  private notificationService = inject(NotificationService);

  readonly notificationList = signal<Notification[]>([]);

  private destroyRef = inject(DestroyRef);

  constructor() {
    console.log('NotificationComponent constructor');
  }

  ngOnInit(): void {


    this.notificationService.notifications$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(n => {
        console.log('notification');
        this.notificationList.update(list => [...list, n]);
        setTimeout(()=> {
          this.dismiss(n.id)
        }, NOTIFICATION_DELAY)
      });
  }

  dismiss(id: number) {
    this.notificationList.update(list => list.filter(n => n.id !== n.id));
  }

}
