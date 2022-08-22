import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import Invitation from '../models/invitationModel';
import User from '../models/userModel';
import { AppError } from '../utils/appError';
import catchAsync from '../utils/catchAsync';

export const createInvitation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('You are not logged in', 401));

    const email = req.user?.email;
    const senderId = req.user?._id;
    const targetEmail = req.body.email;
    console.log('  targetEmail', targetEmail)

    //user can't send invitation to himself
    if (targetEmail === email)
      return next(new AppError("You can't send invitation to yourself", 409));

    //check invitation email exist in database
    const targetUser = await User.findOne({ email:targetEmail });
    console.log('  targetUser', targetUser)

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

    if (checkFriendList) return next(new AppError('Friend Already Added', 409));

    //invitation saving in database
    await Invitation.create({ senderId, receiverId });

    return res.status(201).json({
      status: 'success',
      message: 'Invitation sent',
    });
  }
);


export const getInvitations= catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

if(!req.user) return next(new AppError('You are not logged in.',401));
const id=req.user._id
const invitations=await Invitation.find({receiverId:id}).populate({path:'senderId',select:'name email'}).select('-receiverId')
res.status(201).json({status: 'success',results:invitations.length,data:invitations})
})