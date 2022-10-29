import { Socket } from 'socket.io';
import User from '../models/userModel';

export const authSocket = async(socket: Socket, next: any) => {
  try {

    //getting user details from frontend. send through socket connection. setting user as socket.user

    const user = socket.handshake.auth?.user;
    const newUser = await User.findById(user.id).populate({
      path: 'friends',
      select: 'name email _id photos',
    });
    socket.user = newUser || user;
  } catch (err) {
    return next(new Error('Not authorized to connect'));
  }

  next();
};
