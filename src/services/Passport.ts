import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import passportLocal from 'passport-local';
import User, { UserDocument } from '../models/userModel';
import bcrypt from 'bcryptjs';
// import { NativeError } from "mongoose";

const GoogleStrategy = passportGoogle.Strategy;
const LocalStrategy = passportLocal.Strategy;

const id = process.env.GOOGLE_CLIENT_ID as string;
const secret = process.env.GOOGLE_CLIENT_SECRET as string;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: id,
      clientSecret: secret,
      callbackURL: '/auth/google/redirect',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ googleId: profile.id });

      // If user doesn't exist creates a new user. (similar to sign up)
      if (!user) {
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          photos:profile.photos?.[0].value
          // we are using optional chaining because profile.emails may be undefined.
        });
        if (newUser) {
          done(null, newUser);
        }
      } else {
        done(null, user);
      }
    }
  )
);


passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({  email: email }).select('+password')
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: 'Incorrect username and password. ',
          });
        }
       if(!user.password) return done(null, false,{message:"password not found"})
        return bcrypt.compareSync(password, user.password)
          ? done(null, user)
          : done(null, false, { message: 'Incorrect username and password. ' });
      })
      .catch(() =>
        done(null, false, { message: 'Incorrect username and password. ' })
      );
  })
);
