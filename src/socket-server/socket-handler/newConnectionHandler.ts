import { Server, Socket } from 'socket.io';
import { UserDocument } from '../../models/userModel';
import { addNewConnectedUsers } from '../storeSocketUsers';
import { getFriends } from './friends/getFriends';
import { getPendingInvitations } from './friends/getPendingInvitations';
import { getLastMessagesHandler } from './getLastMessagesHandler';

export const newConnectionHandler = async (
  socket: Socket,
  io: Server
) => {
  addNewConnectedUsers(socket.id, socket.user.id);
  getPendingInvitations(socket.user.id);
  getFriends(socket.user.id);
  getLastMessagesHandler(socket)
};
