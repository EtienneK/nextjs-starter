import assert from 'assert';
import mongoose, { Connection } from 'mongoose';
import { IncomingMessage, NextHandler, ServerResponse } from 'next-connect';

let conn: Connection = null;

export async function getMongooseConnection(): Promise<Connection> {
  if (conn === null) {
    conn = await mongoose.createConnection(process.env.MONGODB_URI, {
      bufferCommands: false,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }
  return conn;
}

export default async function mongooseConnection(
  req: IncomingMessage, res: ServerResponse, next: NextHandler,
): Promise<void> {
  try {
    await getMongooseConnection();
    assert(conn);
    (req as any).mongooseConnection = conn;

    return next();
  } catch (err) {
    return next(err);
  }
}
