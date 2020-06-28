import nextConnect, { NextConnect, ErrorHandler } from 'next-connect';
import { NextApiResponse, NextApiRequest } from 'next';

export default function createHandler(): NextConnect {
  return nextConnect({
    onError: (err: ErrorHandler, req: NextApiRequest, res: NextApiResponse) => {
      console.error(err);
      res.status(500).json({ error: 'unknown server error occured' });
    },
  });
}
