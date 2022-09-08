import { Server } from 'socket.io';
import { UserDocument } from '../../models/userModel';
import { addNewConnectedUsers } from '../storeSocketUsers';
import { getFriends } from './friends/getFriends';
import { getPendingInvitations } from './friends/getPendingInvitations';

export const newConnectionHandler = async (
  socketId: string,
  user: UserDocument,
  io: Server
) => {
  addNewConnectedUsers(socketId, user.id);
  getPendingInvitations(user.id);
  getFriends(user.id);
};
