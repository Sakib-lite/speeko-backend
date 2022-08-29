import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import Invitation from '../../models/invitationModel';
import User, { UserDocument } from '../../models/userModel';
import { getFriends } from '../../socket-server/socket-handler/friends/getFriends';
import { AppError } from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { getPendingInvitations } from './../../socket-server/socket-handler/friends/getPendingInvitations';

export const acceptInvitation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('You are not logged in', 401));
    const userId: Types.ObjectId = req.user._id;
    const { email } = req.body;

    //get the person who sended the invitation
    const invitationSender = await User.findOne({ email });
    if (!invitationSender)
      return next(new AppError('Invitation Sender not found', 404));

    //adding the user who accepted the invitation
    invitationSender.friends.push(userId);
    await invitationSender.save();

    //current user
    const user = await User.findOne({ _id: userId });
    if (!user) return next(new AppError('Please login again', 404));

    //adding the invitation sended to the current user friend list
    user.friends.push(invitationSender._id);
    await user.save();

    //after accepting the invitation ,deleting it from DB
    await Invitation.findOneAndDelete({ receiverId: userId });

    //updating the friend list through socket
    getFriends(req.user.id);
    getFriends(invitationSender.id);
    getPendingInvitations(req.user.id)

    res.status(201).json({ status: 'success', message: 'Invitation accepted' });
  }
);
