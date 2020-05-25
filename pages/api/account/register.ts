import nocache from 'nocache';

import nextConnect from 'next-connect';
import mongooseConnection, { RequestWithConn } from '../../../middlewares/mongoose-connection';
import session from '../../../middlewares/session';
import passport, { RequestWithLogin } from '../../../middlewares/passport';

import AccountModel from '../../../models/Account';
import ValidationError from '../../../validations/ValidationError';
import validateEmail, { normaliseEmail } from '../../../validations/email';
import validatePasswordChange from '../../../validations/password-change';

const handler = nextConnect();

handler.post(
  nocache(),
  mongooseConnection,
  session,
  passport.initialize() as any,
  passport.session() as any,
  async (req: RequestWithConn & RequestWithLogin, res) => {
    let { email } = req.body;
    const { password, confirmPassword } = req.body;
    const validationErrors: Array<ValidationError> = [
      ...validateEmail(email),
      ...validatePasswordChange(password, confirmPassword),
    ];

    if (validationErrors.length) return res.status(400).json({ validationErrors });

    const Account = AccountModel(req.mongooseConnection);

    email = normaliseEmail(email);
    if (await Account.exists({ email })) {
      validationErrors.push({
        field: 'email',
        message: 'An account with this email address already exists.',
      });
      return res.status(400).json({ validationErrors });
    }

    const account = new Account({ email, password });
    await account.save();

    return req.login(account, (err) => {
      if (err) throw err;
      return res.status(201).end();
    });
  },
);

export default handler;
