import { nanoid } from 'nanoid';
import nextConnect, { IncomingMessage } from 'next-connect';
import nocache from 'nocache';
import getConfig from 'next/config';

import mongooseConnection from '../../../../middlewares/mongoose-connection';
import sendEmail from '../../../../services/send-email';
import ValidationError from '../../../../validations/ValidationError';
import validateEmail, { normaliseEmail } from '../../../../validations/email';

import ForgotPasswordTokenModel from '../../../../models/ForgotPasswordToken';
import AccountModel from '../../../../models/Account';

const { publicRuntimeConfig: { appName } } = getConfig();

const handler = nextConnect();

handler.post(
  nocache(),
  mongooseConnection,
  async (req: IncomingMessage, res) => {
    let { email } = req.body;

    const validationErrors: Array<ValidationError> = [
      ...validateEmail(email),
    ];

    if (validationErrors.length) return res.status(400).json({ validationErrors });

    email = normaliseEmail(email);

    const Account = AccountModel((req as any).mongooseConnection);

    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(200).end();
    }

    const ForgotPasswordToken = ForgotPasswordTokenModel((req as any).mongooseConnection);

    const token = nanoid();
    if (await ForgotPasswordToken.exists({ accountId: account.id })) return res.status(200).end();

    const forgotPasswordToken = new ForgotPasswordToken({
      token,
      accountId: account.id,
    });
    await forgotPasswordToken.save();

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/account/reset-password/${token}`;

    await sendEmail(email, `Forgotten password reset for your ${appName} account`, {
      type: 'text/html',
      value: `
        <p><b>Hi,</b></p>
        <p>
          You have recently requested a password reset for your ${appName} account. Please follow the URL below to reset it:
        </p>
        <p>
          <a href='${url}'>${url}</a>
        </p>
        <p>
          If you did not request this password reset, please ignore this email.
        </p>
        <p>
          For security purposes, this password reset request will only be valid for the next 30 minutes.
        </p>
        <p>
          <b>
            Thanks, <br />
            The ${appName} Team
          </b>
        </p>
      `,
    });

    return res.status(200).end();
  },
);

export default handler;
