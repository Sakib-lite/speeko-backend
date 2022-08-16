import express, { NextFunction, Request, Response } from 'express';
import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/appError';

const developmentError: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response
) => {
  console.log('Error:', err);

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const productionError: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response
) => {
  if (err.isOperational) {
    //this kind of errors can be shown to client
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const DBduplicateField = (err: any) => {
  //E11000 duplicate key error collection: eGadget.laptops index: name_1 dup key: { name: "Hp Laptop 5" }
  let val = err.message.match(/{([^}]+)}/)[1].split(':')[1];
  const message = `Duplicate field value: ${val}. Please use another value!`;
  //"Duplicate field value:  \"Hp Laptop 5\" . Please use another value!"
  return new AppError(message, 400);
};

const DBcastError = (err: any) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const DBvalidateError = (err: any) => {
  const errors = Object.values(err?.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

export = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development')
    developmentError(err, req, res, next);
  if (process.env.NODE_ENV === 'production') {
    if (err.code === 11000) err = DBduplicateField(err);
    if (err.name === 'CastError') err = DBcastError(err);
    if (err.name === 'ValidationError') err = DBvalidateError(err);
    productionError(err, req, res, next);
  }
};
