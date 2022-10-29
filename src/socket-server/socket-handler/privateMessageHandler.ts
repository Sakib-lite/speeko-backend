import { Socket } from 'socket.io';
import Conversation from '../../models/conversationModel';
import Message from '../../models/messageModel';
import { Types } from 'mongoose';
import { sendChatHistory } from './friends/getChatHistory';
import { getLastMessagesHandler } from './getLastMessagesHandler';

type Data = {
  message?: string;
  receiver: {
    name: string;
    id: string;
  };
};
export const privateMessageHandler = async (socket: Socket, data: Data) => {
  try {
    const content = data.message;
    const receiver = data.receiver.id;

    const author = socket.user.id;
    const message = await Message.create({
      author,
      content,
      type: 'PRIVATE',
    });

    const messageId = message.id as Types.ObjectId;
    const conversation = await Conversation.findOne({
      participants: {
        $all: [author, receiver],
      },
    });

    // check if conversation exists messageId will be pushed into messages array
    if (conversation) {
      conversation.messages.push(messageId);
      await conversation.save();

      // sending the recent message through socket
      sendChatHistory(conversation.id.toString());

    } else {
      // or new conversattion will be created
      const newConversation = await Conversation.create({
        participants: [author, receiver],
        messages: [messageId],
      });
      // sending the recent message through socket
      sendChatHistory(newConversation.id.toString());
    }
    getLastMessagesHandler(socket)
  } catch (err) {
    console.log(err);
  }
};
