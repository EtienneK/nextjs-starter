import { NextApiRequest, NextApiResponse } from 'next';
import nocache from 'nocache';

import mongooseConnection from '../../../middlewares/mongoose-connection';
import session from '../../../middlewares/session';
import passport, { RequestWithLogin } from '../../../middlewares/passport';

import AccountModel from '../../../models/Account';
import ValidationError from '../../../validations/ValidationError';
import validateEmail, { normaliseEmail } from '../../../validations/email';
import validatePasswordChange from '../../../validations/password-change';
import createHandler from '../../../middlewares/createHandler';

const handler = createHandler();

handler.post(
  nocache(),
  mongooseConnection,
  session,
  passport.initialize() as any,
  passport.session() as any,
  async (req: NextApiRequest & RequestWithLogin, res: NextApiResponse) => {
    let { email } = (req as any).body;
    const { password, confirmPassword } = (req as any).body;
    const validationErrors: Array<ValidationError> = [
      ...validateEmail(email),
      ...validatePasswordChange(password, confirmPassword),
    ];

    if (validationErrors.length) return res.status(400).json({ validationErrors });

    const Account = AccountModel((req as any).mongooseConnection);

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
      return res.status(201).json(account);
    });
  },
);

export default handler;
