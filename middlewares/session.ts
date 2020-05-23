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
    secret: 'super-secret-secret',
    saveUninitialized: false,
    resave: false,
  })(req as any, res, next);
}
