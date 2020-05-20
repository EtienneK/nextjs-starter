import mongoose, { Connection } from 'mongoose';
import { IncomingMessage, NextHandler, ServerResponse } from 'next-connect';

let conn: Connection = null;

export default async function mongooseConnection(
  req: IncomingMessage, res: ServerResponse, next: NextHandler,
): Promise<void> {
  try {
    if (conn === null) {
      conn = await mongoose.createConnection(process.env.MONGODB_URI, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
    }

    (req as any).mongooseConnection = conn;

    return next();
  } catch (err) {
    return next(err);
  }
}
