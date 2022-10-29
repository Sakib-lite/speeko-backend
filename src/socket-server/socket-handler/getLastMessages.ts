import Conversation from '../../models/conversationModel';

export const getLastMessages = async (
  userId: any,
  friends: any[],
  result: any[]
) => {
  try {
    for (let i = 0; i < friends.length; i++) {
      const conversation = await Conversation.findOne({
        participants: {
          $all: [userId, friends[i]._id],
        },
      });
      // console.log(conversation?.messages[conversation.messages.length - 1]);

      const receiver = await Conversation.findById(conversation?.id).populate({
        path: 'messages',
        model: 'Message',
        populate: {
          path: 'author',
          model: 'User',
          select: 'name id photos',
        },
      });

      const msg = {
        participants: receiver?.participants,
        message: receiver?.messages[receiver.messages.length - 1],
      };

      if (msg) result.push(msg);
    }

    return result;
  } catch (err) {
    console.log(err);
  }
};
