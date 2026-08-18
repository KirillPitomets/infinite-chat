import { Controller } from '@nestjs/common';
import { RoomAuthService } from './room-auth.service';

@Controller('room-auth')
export class RoomAuthController {
  constructor(private readonly roomAuthService: RoomAuthService) {}
}
