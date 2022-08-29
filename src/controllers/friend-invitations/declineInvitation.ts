import { NextFunction, Request, Response } from 'express';
import Invitation from '../../models/invitationModel';
import User from '../../models/userModel';
import { AppError } from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

export const declineInvitation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const invitationSender = await User.findOne({ email });
    if (!invitationSender)
      return next(new AppError('Invitation Sender not found', 404));

    // if current user decline the invitation , invitation will deleted from DB
    await Invitation.findOneAndDelete({ senderId: invitationSender._id });

    res.status(200).json({ status: 'success', message: 'Invitation Declined' });
  }
);
