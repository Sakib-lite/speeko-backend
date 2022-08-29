import { getInvitations } from './getInvitations';
import { declineInvitation } from './declineInvitation';
import { sendInvitation } from './sendInvitation';
import { acceptInvitation } from './acceptInvitation';
import { unfriend } from './unfriend';

const invitationController = {
  sendInvitation,
  acceptInvitation,
  getInvitations,
  declineInvitation,
  unfriend,
};

export default invitationController;
