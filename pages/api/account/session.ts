import nextConnect from 'next-connect';
import nocache from 'nocache';
import mongooseConnection from '../../../middlewares/mongoose-connection';
import session from '../../../middlewares/session';
import passport from '../../../middlewares/passport';

const handler = nextConnect();

handler.get(
  nocache(),
  mongooseConnection,
  session,
  passport.initialize() as any,
  passport.session() as any,
  async (req, res) => {
    if ((req as any).user) {
      return res.status(200).end();
    }
    return res.status(401).end();
  },
);

export default handler;
