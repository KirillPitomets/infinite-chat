export interface ServerToClientRoomEvents {
  'room.joined': (payload: { success: boolean; roomId: string }) => void;
  'room.leaved': (payload: { success: boolean; roomId: string }) => void;
}

export interface ClientToServerRoomEvents {
  'room.join': (dto: { roomId: string }) => void;
  'room.leave': (dto: { roomId: string }) => void;
}

export const ClientRoomEvents = {
  JOIN: 'room.join',
  LEAVE: 'room.leave',
};
