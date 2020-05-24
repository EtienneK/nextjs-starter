import { nanoid } from 'nanoid';
import nextConnect from 'next-connect';
import nocache from 'nocache';

import mongooseConnection, { RequestWithConn } from '../../../middlewares/mongoose-connection';
import ForgotPasswordTokenModel from '../../../models/ForgotPasswordToken';
import sendEmail from '../../../services/send-email';

const handler = nextConnect();

handler.post(
  nocache(),
  mongooseConnection,
  async (req: RequestWithConn, res) => {
    const { email } = req.body;

    const ForgotPasswordToken = ForgotPasswordTokenModel(req.mongooseConnection);
    const token = new ForgotPasswordToken({
      token: nanoid(),
    });
    await token.save();

    sendEmail(email, 'Password Reset', {
      type: 'text/html',
      value: `
        <h1>Reset Password</h1>
        <p>
          <a href='http://localhost:3000/api/account/forgot-password/${token.token}'>Click here</a> to reset your password.
        </p>
      `,
    });

    return res.status(200).end();
  },
);

export default handler;
