import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
