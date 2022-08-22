import express, { Request, Response } from 'express';
import passport from 'passport';
import { getAllUsers, getUser, isAdministratorMiddleware, login, logout, signup } from '../controllers/authController';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000',
  })
);
router.post('/signup', signup);

router.post("/login", passport.authenticate("local"),login);

router.get('/logout', logout);
router.get('/user',getUser);

router.get("/users", isAdministratorMiddleware, getAllUsers);


export default router;
