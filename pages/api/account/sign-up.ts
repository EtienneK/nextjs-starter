import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import normalizeEmail from 'validator/lib/normalizeEmail';

import nextConnect from 'next-connect';
import mongooseConnection from '../../../middlewares/mongoose-connection';

import AccountModel from '../../../models/Account';

const handler = nextConnect();

handler.use(mongooseConnection);

handler.post(async (req, res) => {
  let { email } = req.body;
  const { password, confirmPassword } = req.body;
  const validationErrors = [];

  if (!isEmail(email)) validationErrors.push({
    field: 'email',
    message: 'Please enter a valid email address.'
  })
  else if (!isLength(email, { min: 5, max: 255 })) validationErrors.push({
    field: 'email',
    message: 'Email must be at minimum 5 and at maximum 255 characters in length.'
  });

  if (!isLength(password, { min: 8, max: 255 })) validationErrors.push({
    field: 'password',
    message: 'Password must be at minimum 8 and at maximum 255 characters in length.'
  });

  if (password !== confirmPassword) validationErrors.push({
    field: 'confirmPassword',
    message: 'Passwords do not match.'
  });

  if (validationErrors.length) return res.status(400).json({ validationErrors });

  const Account = AccountModel((req as any).mongooseConnection);

  email = normalizeEmail(req.body.email, { gmail_remove_dots: false });
  if (await Account.exists({ email })) {
    validationErrors.push({
      field: 'email',
      message: 'An account with this email address already exists.'
    });
    return res.status(400).json({ validationErrors });
  }

  const account = new Account({ email, password });
  await account.save();

  return res.status(201).send(null);
});

export default handler;
