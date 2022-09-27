import { Types } from 'mongoose';
import Conversation from '../../../models/conversationModel';
import { getInstanceIO } from '../../getInstance';
import { getActiveSocketUserList } from '../../storeSocketUsers';

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
        select: 'name id',
      },
    });

    if (conversation) {
      // getting the io(server) instance
      const io = getInstanceIO();

      //   after loading messenger this event will trigger for every socket user. who have previous conversation history
      if (specificUser) {
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
