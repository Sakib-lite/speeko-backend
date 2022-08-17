import { Socket } from 'socket.io';

export const authSocket = (socket: Socket, next: any) => {
  try {
    const user = socket.handshake.auth?.user;
    socket.user = user;
  } catch (err) {
    return next(new Error('Not authorized to connect'));
  }

  next();
};
