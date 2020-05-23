import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { IncomingMessage } from 'next-connect';
import { RequestWithConn } from './mongoose-connection';
import AccountModel, { AccountInterface } from '../models/Account';

passport.serializeUser((account: AccountInterface, done) => {
  done(null, account.id);
});

passport.deserializeUser(async (
  req: RequestWithConn, id: string, done: (err: any, account?: AccountInterface) => void,
) => {
  try {
    const Account = AccountModel(req.mongooseConnection);
    const account = await Account.findById(id);
    done(null, account);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      const Account = AccountModel(((req as unknown) as RequestWithConn).mongooseConnection);

      const account = await Account.findOne({ email });
      if (account && (await bcrypt.compare(password, account.password))) done(null, account);
      else done(null, false, { message: 'Invalid email or password.' });
    },
  ),
);

export type RequestWithLogin = IncomingMessage & {
  login(account: AccountInterface, done: (err: any) => void): void;
};

export default passport;
