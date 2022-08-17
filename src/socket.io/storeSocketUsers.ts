const connectedUsers = new Map();

export const addNewConnectedUsers = (
  sockectId: string,
  userId: string
): void => {
  connectedUsers.set(sockectId, { userId });
};

export const removeConnectedUser = (socketId: string): void => {
  if (connectedUsers.has(socketId)) {
    connectedUsers.delete(socketId);
  }
};
