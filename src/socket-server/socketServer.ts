import { Server } from 'http';
import socket, { Socket } from 'socket.io';
import { UserDocument } from '../models/userModel';
import { authSocket } from './authSocket';
import { setInstance } from './getInstance';
import { disconnectHandler } from './socket-handler/disconnectHandler';
import { onlineUsers } from './socket-handler/friends/onlineUsers';
import { newConnectionHandler } from './socket-handler/newConnectionHandler';
import { privateChatHistoryHandler } from './socket-handler/privateChatHistoryHandler';
import { privateMessageHandler } from './socket-handler/privateMessageHandler';

//adding user type in socket.d.ts
declare module 'socket.io' {
  interface Socket {
    user: UserDocument;
  }
}

export const registerSocket = (
  server: Partial<socket.ServerOptions> | Server | undefined
) => {
  const io = new socket.Server(server, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET,OPTIONS,PUT,PATCH,POST,DELETE'],
    },
  });

  //sharing the io instance through out the apps
  setInstance(io);

  //setting socket.user
  io.use((socket: Socket, next) => {
    authSocket(socket, next);
  });

  io.on('connection', (socket: Socket) => {
    //adding new user in map list
    newConnectionHandler(socket.id, socket.user, io);
    console.log('user connected');

    // get private message and store it in message model
    socket.on('private-message', (data) => {
      privateMessageHandler(socket, data);
    });

    socket.on('private-chat-history', (data) => {
      privateChatHistoryHandler(socket, data);
    });

    //delete user from map list
    socket.on('disconnect', () => {
      disconnectHandler(socket);
    });
  });

  //checking the user is online, in every 10 seconds
  setInterval(() => {
    onlineUsers();
  }, 1000 * 10);
};
