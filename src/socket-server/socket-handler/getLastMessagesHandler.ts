import { Socket } from 'socket.io';
import { getInstanceIO } from '../getInstance';
import { getActiveSocketUserList } from './../storeSocketUsers';
import { getLastMessages } from './getLastMessages';

export const getLastMessagesHandler = async (socket: Socket) => {
  const user = socket.user;

  const userList = getActiveSocketUserList(user.id);
  const io = getInstanceIO();
  const result: any[] = [];
  const lastMessages = await getLastMessages(user.id, user.friends, result);

  //emit last messages
  userList.forEach((socketId: string) => {
    io.to(socketId).emit('last-messages', {
      lastMessages: lastMessages ? lastMessages : [],
    });
  });
};
