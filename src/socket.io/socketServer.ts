import { Server } from 'http';
import socket, { Socket } from 'socket.io';
import { authSocket } from './authSocket';
import { disconnectHandler } from './socket-handler/disconnectHandler';
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

  io.use((socket: Socket, next) => {
    authSocket(socket, next);
  });

  io.on('connection', (socket: Socket) => {
    newConnectionHandler(socket.id, socket.user, io);
    console.log('user connected');
    console.log('  socket', socket.id);

    socket.on('disconnect', () => {
      disconnectHandler(socket);
    });
  });
};
