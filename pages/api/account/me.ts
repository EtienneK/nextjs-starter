import nextConnect from 'next-connect';
import nocache from 'nocache';
import mongooseConnection from '../../../middlewares/mongoose-connection';
import session from '../../../middlewares/session';
import passport from '../../../middlewares/passport';
import isAuthenticated from '../../../middlewares/is-authenticated';

const handler = nextConnect();

handler.get(
  nocache(),
  mongooseConnection,
  session,
  passport.initialize() as any,
  passport.session() as any,
  isAuthenticated,
  async (req, res) => {
    res.status(200).json((req as any).user);
  },
);

export default handler;
