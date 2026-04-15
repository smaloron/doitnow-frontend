import {Component, inject, OnInit, signal} from '@angular/core';
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

  ngOnInit(): void {
    this.notificationService.notifications$
      .pipe(takeUntilDestroyed())
      .subscribe(n => {
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
