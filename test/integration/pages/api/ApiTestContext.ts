/* eslint-disable no-underscore-dangle */
import http from 'http';
import listen from 'test-listen';
import { apiResolver } from 'next/dist/next-server/server/api-utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { NextConnect } from 'next-connect';

export default class ApiTestContext {
  _mongoServer: MongoMemoryServer;

  _server: http.Server;

  _serverUrl: string;

  async init(handler: NextConnect): Promise<void> {
    this._server = http.createServer(
      (req, res) => apiResolver(req, res, undefined, handler, undefined),
    );
    this._serverUrl = await listen(this._server);
    this._mongoServer = new MongoMemoryServer();

    process.env.MONGODB_URI = await this._mongoServer.getUri();
    process.env.SECUREKEY = 'enwkjngjnerkgnnkjreg,kjrbgrbegbjrebger';
  }

  async destroy(done: jest.DoneCallback): Promise<void> {
    this._server.close(done);
    await this._mongoServer.stop();
  }

  get server(): http.Server {
    return this._server;
  }

  get serverUrl(): string {
    return this._serverUrl;
  }
}
