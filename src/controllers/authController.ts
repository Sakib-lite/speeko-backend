import { NextFunction, Request, Response } from 'express';
import User, { UserDocument } from '../models/userModel';
import catchAsync from './../utils/catchAsync';
import { AppError } from '../utils/appError';
import { v2 as cloudinary } from 'cloudinary'

require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, confirmPassword,image } = req.body;

    if (!email || !name || !password || !confirmPassword || !image)
      return next(new AppError('Fill up all the fields', 406));
    if (password !== confirmPassword)
      return next(new AppError("Password doesn't match", 406));
    const user = await User.findOne({ email });
    if (user)
      return next(new AppError('User already exists with this email', 409));

      const uploadResponse = await cloudinary.uploader.upload(image, {
        upload_preset: 'd3z47zme',
    });


    let newUser = await User.create({
      name,
      email,
      password,
      photos:uploadResponse.secure_url
    });
    newUser.password = undefined;
    newUser.isAdmin = undefined;

    res.status(201).json({
      status: 'success',
      data: newUser,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) req.user.password = undefined;
    if (!req.user) return next(new AppError('No session', 404));
    res.status(200).json({
      status: 'success',
      message: 'You are logged in',
      user: req.user,
    });
  }
);

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.json({
      status: 'success',
      message: 'You are logged out',
      user: req.user,
    });
  });
};

export const isAdministratorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user }: any = req;
  if (user) {
    User.findOne({ email: user.email }, (err: any, doc: UserDocument) => {
      if (err) throw err;
      if (doc?.isAdmin) {
        next();
      } else {
        res.send("Sorry, only admin's can perform this.");
      }
    }).select('+isAdmin');
  } else {
    res.send('Sorry, you arent logged in');
  }
};

export const getUser = (req: Request, res: Response) => {
  res.status(201).json({
    status: 'success',
    user: req.user,
  });
};

type Users = UserDocument[] | [];

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users: Users = await User.find().select('name email');
  res.status(200).json({ status: 'success', data: users });
});
