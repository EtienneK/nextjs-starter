import expressSession from 'express-session';
import connectMongo from 'connect-mongo';

import { RequestWithConn } from './mongoose-connection';

const MongoStore = connectMongo(expressSession);

export default function session(req: RequestWithConn, res, next): any {
  const mongoStore = new MongoStore({
    mongooseConnection: req.mongooseConnection,
  });
  return expressSession({
    store: mongoStore,
    secret: process.env.SECUREKEY.split(','),
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
      sameSite: 'lax',
    },
  })(req as any, res, next);
}
