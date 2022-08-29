import { getInstanceIO } from '../../getInstance';
import { getOnlineUsers } from '../../storeSocketUsers';

export const onlineUsers = () => {
  const io = getInstanceIO();

  io.emit('online-users', {
    onlineUsers:getOnlineUsers(),
  });
};
