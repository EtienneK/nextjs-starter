import nextConnect from 'next-connect';
import mongooseConnection from '../../../middlewares/mongoose-connection';

const handler = nextConnect();

handler.use(mongooseConnection);

handler.post((req, res) => {
  const { email, password, confirmPassword } = req.body;

  return res.status(201).json('done');
});

export default handler;
