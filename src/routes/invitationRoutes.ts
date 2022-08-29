import express, { Request, Response } from 'express';
import invitationController from '../controllers/friend-invitations/invitationController';
const router = express.Router();

router
  .route('/invite')
  .post(invitationController.sendInvitation)
  .get(invitationController.getInvitations);
router.route('/accept-invitation').post(invitationController.acceptInvitation);
router
  .route('/decline-invitation')
  .post(invitationController.declineInvitation);
router.route('/unfriend').post(invitationController.unfriend);

export default router;
