import { NextFunction, Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import User from '../../models/userModel';
import { getFriends } from '../../socket-server/socket-handler/friends/getFriends';
import { AppError } from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

export const unfriend = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError('You are not logged in', 401));

    const currentId = req.user.id;
    const targetId: Types.ObjectId = req.body.id;

    //deleting the target from current user's 'friends' array
    const currentUser = await User.findOneAndUpdate(
      { _id: currentId },
      { $pull: { friends: new mongoose.Types.ObjectId(targetId) } },
      { new: true }
    );

    if (!currentUser)
      return next(new AppError('Sorry Unfriend operation gone wrong', 404));

    //deleting the current user from target user's 'friends' array

    const targetUser = await User.findOneAndUpdate(
      { _id: targetId },
      { $pull: { friends: new mongoose.Types.ObjectId(currentId) } },
      { new: true }
    );

    if (!targetUser)
      return next(new AppError('Sorry Unfriend operation gone wrong', 404));

    //updating the friend list through socket
    getFriends(currentId);
    getFriends(targetUser.id);

    res
      .status(200)
      .json({ status: 'success', message: 'Unfriend operation seccuessful' });
  }
);
