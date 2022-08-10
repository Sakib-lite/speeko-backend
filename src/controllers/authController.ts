import express, { NextFunction, Request, Response } from 'express';
import User, { UserDocument } from '../models/userModel';
import bcryptjs from 'bcryptjs';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!email || !name || !password) throw new Error('Fill up all the fields');
    if (password !== confirmPassword) throw new Error("Password doesn't match");
    const user = await User.findOne({ email });
    if (user) throw new Error('User already exists with this email');
    let newUser = await User.create({
      name,
      email,
      password,
    });
    newUser.password='undefined';
    newUser.isAdmin=undefined

    
    res.status(200).json({
      status: 'success',
      data: newUser,
    });
  } catch (err) {
    console.log(err);
  }
};

export const login = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: 'status', message: 'you are logged in', user: req.user });
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.json({ status: 'success', message: 'you logged out', user: req.user });
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
    }).select('isAdmin');
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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: Users = await User.find().select('isAdmin');
    res.status(200).json({ status: 'success', data: users });
  } catch (err) {
    console.log(err);
  }
};
