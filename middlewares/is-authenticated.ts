import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

export default function isAuthenticated(
  req: NextApiRequest, res: NextApiResponse, next: NextHandler,
): any {
  if ((req as any).user) {
    return next();
  }
  return res.status(401).end();
}
