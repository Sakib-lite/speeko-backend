import { NextFunction, Request, Response } from 'express';
import Invitation from '../../models/invitationModel';
import { AppError } from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';



export const getInvitations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('You are not logged in.', 401));
    const id = req.user._id;
    const invitations = await Invitation.find({ receiverId: id })
      .populate({ path: 'senderId', select: 'name email' })
      .select('-receiverId');

      
    res.status(201).json({
      status: 'success',
      results: invitations.length,
      data: invitations,
    });
  }
);