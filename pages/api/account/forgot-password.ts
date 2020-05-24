import nextConnect from 'next-connect';
import nocache from 'nocache';
import mongooseConnection, { RequestWithConn } from '../../../middlewares/mongoose-connection';

const handler = nextConnect();

handler.post(
  nocache(),
  mongooseConnection,
  async (req: RequestWithConn, res) => {
    res.status(200).end();
  },
);

export default handler;
