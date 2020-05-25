import nextConnect from 'next-connect';
import nocache from 'nocache';
import mongooseConnection from '../../../middlewares/mongoose-connection';
import session from '../../../middlewares/session';
import passport from '../../../middlewares/passport';
import isAuthenticated from '../../../middlewares/is-authenticated';
import { AccountInterface } from '../../../models/Account';

const handler = nextConnect();

handler.get(
  nocache(),
  mongooseConnection,
  session,
  passport.initialize() as any,
  passport.session() as any,
  isAuthenticated,
  async (req, res) => {
    const account = (req as any).user as AccountInterface;
    const { id, email } = account;
    res.status(200).json({
      id,
      email,
      avatar: {
        med: account.gravatar(72),
      },
    });
  },
);

export default handler;
