import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import Conversation from '../../models/conversationModel';
import { sendChatHistory } from './friends/getChatHistory';
import { getLastMessagesHandler } from './getLastMessagesHandler';

export const privateChatHistoryHandler = async (
  socket: Socket,
  receiverId: Types.ObjectId
) => {
  try {
    const author = socket.user.id;

    const conversation = await Conversation.findOne({
      participants: {
        $all: [author, receiverId],
      },
    });

    if (conversation) {
      sendChatHistory(conversation.id.toString(), socket.id);
      getLastMessagesHandler(socket)
    }
  } catch (err) {
    console.log(err);
  }
};
