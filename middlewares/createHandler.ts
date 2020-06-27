import nextConnect, { NextConnect } from 'next-connect';

export default function createHandler(): NextConnect {
  return nextConnect({
    onError: (err, req, res) => {
      console.error(err);
      res.status(500).json({ error: 'unknown server error occured' });
    },
  });
}
