import { UserDocument } from "./models/userModel";

declare module 'socket.io' {
  interface Socket {
    user: UserDocument
  }
}
