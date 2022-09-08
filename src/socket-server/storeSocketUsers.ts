

const connectedUsers = new Map();

//if any user gets online they will be added in map list
export const addNewConnectedUsers = (
  sockectId: string,
  userId: string
): void => {
  connectedUsers.set(sockectId, { userId });
  

};

//deleting disconnected user from map list. 
export const removeConnectedUser = (socketId: string): void => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);

  
  }
};

export const getActiveSocketUserList = (id: string) => {
  const users: any = [];
  connectedUsers.forEach((value, key) => {
    if (value.userId === id) users.push(key);
  });

  return users;
};

//online users array
export const getOnlineUsers = () => {
  const onlineUsers: { socketId: string; id: string; }[] = [];

  connectedUsers.forEach((value, key) => {
    onlineUsers.push({ socketId: key, id: value.userId});
  });
  return onlineUsers;
};

/*
  after login user will be counted as connectedUsers.
if user disconnect he or she will be removed from connectedUsers list,
  
  connectedUsers Map(2) {
  'KN30N1MjzIXKzulmAAAB' => { userId: '62fa980157ca653fa67f85e4' },
  'MPKm1zKxu7hy6gzoAAAD' => { userId: '62fbae413d675f8e9b598d53' }
}
*/
