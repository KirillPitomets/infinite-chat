import { Server, Socket } from 'socket.io';

export class BaseGateway {
  protected disconnectedWithError(client: Socket, err: unknown) {
    client.emit('exception', {
      status: 'error',
      error: err || 'Unexpected error, try again later',
      timestamp: new Date().toISOString(),
    });
    client.disconnect();
  }

  protected async leaveRoomForUser<S extends Server>(
    server: S,
    userId: string,
    roomId: string,
  ) {
    const sockets = await server.in(`user:${userId}`).fetchSockets();
    sockets.forEach((socket) => socket.leave(`room:${roomId}`));
  }

  protected async addRoomForUser<S extends Server>(
    server: S,
    userId: string,
    roomId: string,
  ) {
    const sockets = await server.in(`user:${userId}`).fetchSockets();

    sockets.forEach((socket) => socket.join(`room:${roomId}`));
  }

  protected joinToAllClientRooms<C extends Socket>(
    client: C,
    roomIds: string[],
  ) {
    client.join(roomIds.map((id) => `room:${id}`));
  }
}
