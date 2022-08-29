import Invitation from '../../../models/invitationModel';
import { getInstanceIO } from '../../getInstance';
import { getActiveSocketUserList } from '../../storeSocketUsers';

export const getPendingInvitations = async (userId: string) => {
  try {
    //populating the sender for rendering invitation list
    const invitations = await Invitation.find({ receiverId: userId })
      .populate({ path: 'senderId', select: 'name email' })
      .select('-receiverId');

    const userList = getActiveSocketUserList(userId);
    const io = getInstanceIO();

    //emit the invitations in the room with socket id
    userList.forEach((socketId: string) => {
      io.to(socketId).emit('friends-invitations', {
        pendingInvitations: invitations ? invitations : [],
      });
    });
  } catch (err) {
    console.log(err);
  }
};
