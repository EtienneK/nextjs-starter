import nextConnect from 'next-connect';
import nocache from 'nocache';
import { isArray } from 'util';

import mongooseConnection, { RequestWithConn } from '../../../../middlewares/mongoose-connection';
import ValidationError from '../../../../validations/ValidationError';

import ForgotPasswordTokenModel from '../../../../models/ForgotPasswordToken';
import AccountModel from '../../../../models/Account';
import validatePasswordChange from '../../../../validations/password-change';

const handler = nextConnect();

handler.get(
  nocache(),
  mongooseConnection,
  async (req: RequestWithConn, res) => {
    const { query: { token } } = req;
    if (!token || isArray(token)) return res.status(404).end();

    const ForgotPasswordToken = ForgotPasswordTokenModel(req.mongooseConnection);
    const forgotPasswordToken = await ForgotPasswordToken.findOne({ token });
    if (!forgotPasswordToken) return res.status(404).end();

    return res.status(200).end();
  },
);

handler.post(
  nocache(),
  mongooseConnection,
  async (req: RequestWithConn, res) => {
    const { query: { token } } = req;
    if (!token) return res.status(404).end();

    const { password, confirmPassword } = req.body;

    const validationErrors: Array<ValidationError> = [
      ...validatePasswordChange(password, confirmPassword),
    ];

    if (validationErrors.length) return res.status(400).json({ validationErrors });

    const ForgotPasswordToken = ForgotPasswordTokenModel(req.mongooseConnection);
    const forgotPasswordToken = await ForgotPasswordToken.findOne({ token });
    if (!forgotPasswordToken) return res.status(404).end();

    const Account = AccountModel(req.mongooseConnection);
    const account = await Account.findById(forgotPasswordToken.accountId);
    if (!account) return res.status(404).end();

    account.password = password;
    await account.save();

    await forgotPasswordToken.remove();

    return res.status(200).end();
  },
);

export default handler;
