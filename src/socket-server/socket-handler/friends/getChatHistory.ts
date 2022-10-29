import { Types } from 'mongoose';
import Conversation from '../../../models/conversationModel';
import { getInstanceIO } from '../../getInstance';
import { getSocketInstance } from '../../getSocketInstance';
import { getActiveSocketUserList } from '../../storeSocketUsers';
import { getLastMessagesHandler } from '../getLastMessagesHandler';

export const sendChatHistory = async (
  conversationId: Types.ObjectId,
  specificUser: null | string = null
) => {
  try {
    const conversation = await Conversation.findById(conversationId).populate({
      path: 'messages',
      model: 'Message',
      populate: {
        path: 'author',
        model: 'User',
        select: 'name id photos',
      },
    });

    if (conversation) {
      // getting the io(server) instance
      const io = getInstanceIO();
      const socket=getSocketInstance()

      //   after loading messenger this event will trigger for every socket user. who have previous conversation history
      if (specificUser) {
        getLastMessagesHandler(socket)
        return io.to(specificUser).emit('private-chat-history', {
          messages: conversation.messages,
          participants: conversation.participants,
        });
      }

      //   this event will trigger whenever we send messages. i
      conversation.participants.forEach((userId) => {
        const activeParticipantList = getActiveSocketUserList(
          userId.toString()
        );

        activeParticipantList.forEach((friendSocketId: string) => {
         
          getLastMessagesHandler(socket)
          io.to(friendSocketId).emit('private-chat-history', {
            messages: conversation.messages,
            participants: conversation.participants,
          });
        });
      });
    }

  } catch (err) {
    console.log(err);
  }
};
