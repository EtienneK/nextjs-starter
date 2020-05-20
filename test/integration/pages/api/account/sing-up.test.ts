import http from 'http';
import fetch from 'isomorphic-unfetch';
import listen from 'test-listen';
import { apiResolver } from 'next/dist/next-server/server/api-utils';
import { MongoMemoryServer } from 'mongodb-memory-server';

import handler from '../../../../../pages/api/account/sign-up';
import AccountModel from '../../../../../models/Account';
import { getMongooseConnection } from '../../../../../middlewares/mongoose-connection';

describe('Integration tests for: /api/account/sign-up', () => {
  let mongoServer: MongoMemoryServer;
  let server: http.Server;
  let url: string;

  beforeAll(async () => {
    server = http.createServer((req, res) => apiResolver(req, res, undefined, handler, undefined));
    url = await listen(server);

    mongoServer = new MongoMemoryServer();
    process.env.MONGODB_URI = await mongoServer.getUri();
  });

  afterAll(async (done) => {
    server.close(done);
    await mongoServer.stop();
  });

  test('Should create a new account successfully', async () => {
    // Arrange
    const email = 'me@example.com';
    const password = 'password123';

    // Act
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, confirmPassword: password }),
    });

    // Assert
    expect(response.status).toBe(201);
    expect(await response.text()).toEqual('');
    const foundUser = await AccountModel(getMongooseConnection()).findOne({ email });
    expect(foundUser.email).toEqual(email);
  });
});
