import express, { Request, Response } from 'express';
import { createInvitation, getInvitations } from '../controllers/invitationController';

const router = express.Router();

router.route('/invite').post(createInvitation).get(getInvitations)

export default router;
