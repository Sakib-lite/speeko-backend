import User from '../../../models/userModel';
import { getInstanceIO } from '../../getInstance';
import { getActiveSocketUserList } from '../../storeSocketUsers';

export const getFriends = async (userId: string) => {
  try {
    //populating the friends array for rendering chat list
    const user = await User.findById(userId).populate({
      path: 'friends',
      select: 'name email _id photos',
    });

    const userList = getActiveSocketUserList(userId);

    const io = getInstanceIO();

    //emit the friend list in the room with socket id
    userList.forEach((socketId: string) => {
      io.to(socketId).emit('friend-list', {
        friends: user?.friends ? user.friends : [],
      });
    });
  } catch (err) {
    console.log(err);
  }
};
