import nextConnect from 'next-connect';
import nocache from 'nocache';
import mongooseConnection from '../../../middlewares/mongoose-connection';
import session from '../../../middlewares/session';
import passport, { RequestWithLogout } from '../../../middlewares/passport';

const handler = nextConnect();

handler.post(
  nocache(),
  mongooseConnection,
  session,
  passport.initialize() as any,
  passport.session() as any,
  passport.authenticate('local') as any,
  async (req, res) => {
    res.status(200).end();
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
