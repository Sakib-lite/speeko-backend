import { Server } from 'socket.io';


let io: Server 
export const setInstance = (ioInstance: Server) => {
   io=ioInstance
};

export const getInstanceIO = () => {
  return io;
};
