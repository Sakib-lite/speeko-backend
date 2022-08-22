import { Server } from 'socket.io';
import { User } from 'socket.io/dist/socket';
import { addNewConnectedUsers } from '../storeSocketUsers';

export const newConnectionHandler = async (
  socketId: string,
  user: User,
  io: Server
) => {
  addNewConnectedUsers(socketId, user.id);
};
