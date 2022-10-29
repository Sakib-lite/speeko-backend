import  { Socket } from 'socket.io';


let socket: Socket 
export const setSocketInstance = (socketInstance: Socket) => {
   socket=socketInstance
};

export const getSocketInstance = () => {
  return socket;
};
