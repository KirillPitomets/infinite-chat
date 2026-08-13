import { WebSocketGateway } from '@nestjs/websockets';
import { NotificationService } from './notification.service';

@WebSocketGateway()
export class NotificationGateway {
  constructor(private readonly notificationService: NotificationService) {}
}
