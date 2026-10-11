import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEventMap, AppEventName } from './event-map';

@Injectable()
export class TypedEventEmitterService {
  constructor(private readonly emitter: EventEmitter2) {}

  emit<K extends AppEventName>(event: K, payload: AppEventMap[K]) {
    return this.emitter.emit(event, payload);
  }
}
