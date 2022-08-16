import express, { Response, Request, NextFunction } from 'express';

export = (
  fn: (arg0: Request, arg1: Response, arg2: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
