import { Socket } from 'socket.io';
import { removeConnectedUser } from '../storeSocketUsers';

export const disconnectHandler = async (socket: Socket): Promise<void> => {
  removeConnectedUser(socket.id);
};
