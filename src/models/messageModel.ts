import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    type: { type: String, enum: ['PRIVATE', 'GROUP'], default: 'PRIVATE' },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
