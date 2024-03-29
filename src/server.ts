import express, { Application, Request, Response } from 'express';
import { connectToDatabase } from './database/db';
import authRoutes from './routes/authRoutes';
import invitationRoutes from './routes/invitationRoutes';
import passport from 'passport';
import sessions from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './services/Passport';
import errorController from './controllers/errorController';
import { registerSocket } from './socket-server/socketServer';

if (process.env.NODE_ENV !== 'production') require('dotenv').config(); //environment variable
const app: Application = express();

// cors
app.disable('X-Powered-By');

app.set('trust proxy', 1);

app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  })
);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  })
);



app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// express session
const oneDay: number = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true,
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

connectToDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/friend', invitationRoutes);

app.use(errorController);

const server = app.listen(process.env.PORT || 5001, (): void =>
  console.log(`app is running at @${process.env.PORT || 5001}`)
);

registerSocket(server);
