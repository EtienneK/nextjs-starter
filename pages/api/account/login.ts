import nocache from 'nocache';
import mongooseConnection from '../../../middlewares/mongoose-connection';
import session from '../../../middlewares/session';
import passport, { RequestWithLogout } from '../../../middlewares/passport';
import createHandler from '../../../middlewares/createHandler';

const handler = createHandler();

handler.post(
  nocache(),
  mongooseConnection,
  session,
  passport.initialize() as any,
  passport.session() as any,
  passport.authenticate('local') as any,
  async (req, res) => {
    res.status(200).json((req as any).user);
  },
);

handler.delete(
  nocache(),
  mongooseConnection,
  session,
  passport.initialize() as any,
  passport.session() as any,
  (req: RequestWithLogout, res) => {
    req.logout();
    res.status(200).end();
  },
);

export default handler;
