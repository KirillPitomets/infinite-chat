import { PickType } from '@nestjs/swagger';
import { CreateGroupRoomDto } from './create-group.dto';

export class UpdateGroupNameDto extends PickType(CreateGroupRoomDto, [
  'name',
]) {}
