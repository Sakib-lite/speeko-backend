import { Server } from 'http';
import socket, { Socket } from 'socket.io';
import { authSocket } from './authSocket';
import { setInstance } from './getInstance';
import { disconnectHandler } from './socket-handler/disconnectHandler';
import { onlineUsers } from './socket-handler/friends/onlineUsers';
import { newConnectionHandler } from './socket-handler/newConnectionHandler';

export const registerSocket = (
  server: Partial<socket.ServerOptions> | Server | undefined
) => {
  const io = new socket.Server(server, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET,OPTIONS,PUT,PATCH,POST,DELETE'],
    },
  });

  setInstance(io);

  io.use((socket: Socket, next) => {
    authSocket(socket, next);
  });

  io.on('connection', (socket: Socket) => {
  
    newConnectionHandler(socket.id, socket.user, io);
    console.log('user connected');

    socket.on('disconnect', () => {
      disconnectHandler(socket);
    });
  });

  //checking the user is online, every 5 seconds
  setInterval(() => {
    onlineUsers();
  },1000*10);
};
