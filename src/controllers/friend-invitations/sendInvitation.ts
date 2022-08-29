import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import Invitation from '../../models/invitationModel';
import User, { UserDocument } from '../../models/userModel';
import { getPendingInvitations } from '../../socket-server/socket-handler/friends/getPendingInvitations';
import { AppError } from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

export const sendInvitation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('You are not logged in', 401));

    const email = req.user?.email;
    const senderId = req.user?._id;
    const targetEmail = req.body.email;

    //user can't send invitation to himself
    if (targetEmail === email)
      return next(new AppError("You can't send invitation to yourself", 409));

    //check invitation email exist in database
    const targetUser = await User.findOne({ email: targetEmail });

    if (!targetUser) return next(new AppError('No user found ', 404));

    const receiverId = targetUser._id;

    //check if invitation already sent
    const existingInvitation = await Invitation.findOne({
      senderId,
      receiverId,
    });
    if (existingInvitation)
      return next(new AppError('Invitation has already been sent', 409));

    //check if invitation email exist in user friend list
    const checkFriendList = targetUser.friends.find(
      (id: Types.ObjectId) => id.toString() === senderId.toString()
    );

    if (checkFriendList)
      return next(new AppError('Friend has already been added', 409));

    //invitation saving in database
    await Invitation.create({ senderId, receiverId });

    //sending the invitation list to users through the socket
    getPendingInvitations(receiverId.toString()); 

    return res.status(201).json({
      status: 'success',
      message: 'Invitation sent',
    });
  }
);
