import mongoose, { Types } from 'mongoose';


export type ConversationDocument = Document & {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
};

const conversationSchema = new mongoose.Schema<ConversationDocument>({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
