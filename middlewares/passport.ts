import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { IncomingMessage } from 'next-connect';
import AccountModel, { AccountInterface } from '../models/Account';
import { normaliseEmail } from '../validations/email';

passport.serializeUser((account: AccountInterface, done) => {
  done(null, account.id);
});

passport.deserializeUser(async (
  req: IncomingMessage, id: string, done: (err: any, account?: AccountInterface) => void,
) => {
  try {
    const Account = AccountModel((req as any).mongooseConnection);
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
      const Account = AccountModel((req as any).mongooseConnection);
      const normalizedEmail = normaliseEmail(email);
      if (!normalizedEmail) return done(null, false, { message: 'Invalid email or password.' });
      const account = await Account.findOne({ email: normalizedEmail });
      if (account && (await bcrypt.compare(password, account.password))) return done(null, account);
      return done(null, false, { message: 'Invalid email or password.' });
    },
  ),
);

export type RequestWithLogin = IncomingMessage & {
  login(account: AccountInterface, done: (err: any) => void): void;
};

export type RequestWithLogout = IncomingMessage & {
  logout(): void;
};

export default passport;
