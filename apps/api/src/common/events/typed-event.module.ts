import { Module } from '@nestjs/common';
import { TypedEventEmitterService } from './typed-event-emitter.service';

@Module({
  providers: [TypedEventEmitterService],
  exports: [TypedEventEmitterService],
})
export class TypedEventEmitterModule {}
