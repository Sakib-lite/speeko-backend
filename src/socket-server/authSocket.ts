import { Socket } from 'socket.io';

export const authSocket = (socket: Socket, next: any) => {
  try {

    //getting user details from frontend. send through socket connection. setting user as socket.user

    const user = socket.handshake.auth?.user;
    socket.user = user;
  } catch (err) {
    return next(new Error('Not authorized to connect'));
  }

  next();
};
