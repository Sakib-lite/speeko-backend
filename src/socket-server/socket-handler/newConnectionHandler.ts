import { Server } from 'socket.io';
import { User } from 'socket.io/dist/socket';
import { addNewConnectedUsers } from '../storeSocketUsers';
import { getFriends } from './friends/getFriends';
import { getPendingInvitations } from './friends/getPendingInvitations';

export const newConnectionHandler = async (
  socketId: string,
  user: User,
  io: Server
) => {
  addNewConnectedUsers(socketId, user.id);
  getPendingInvitations(user.id);
  getFriends(user.id);
};
