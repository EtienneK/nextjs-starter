import http from 'http';
import fetch from 'isomorphic-unfetch';
import listen from 'test-listen';
import { apiResolver } from 'next/dist/next-server/server/api-utils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';

import handler from '../../../../../pages/api/account/sign-up';
import AccountModel, { AccountInterface } from '../../../../../models/Account';
import { getMongooseConnection } from '../../../../../middlewares/mongoose-connection';

describe('Integration tests for: /api/account/sign-up', () => {
  let mongoServer: MongoMemoryServer;
  let server: http.Server;
  let url: string;
  let Account: Model<AccountInterface, {}>;

  beforeAll(async () => {
    server = http.createServer((req, res) => apiResolver(req, res, undefined, handler, undefined));
    url = await listen(server);

    mongoServer = new MongoMemoryServer();
    process.env.MONGODB_URI = await mongoServer.getUri();

    Account = AccountModel(await getMongooseConnection());
  });

  afterAll(async (done) => {
    server.close(done);
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Account.deleteMany({});
  });

  test('Should create a new account successfully', async () => {
    // Arrange
    const email = 'me@example.com';
    const password = 'password123';
    const body = JSON.stringify({ email, password, confirmPassword: password });

    // Act
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    // Assert
    expect(response.status).toBe(201);
    expect(await response.text()).toEqual('');
    const foundUser = await Account.findOne({ email });
    expect(foundUser.email).toEqual(email);
    expect(await Account.countDocuments({})).toEqual(1);
  });

  test('Should return 400 with validation errors if no body is sent', async () => {
    // Arrange
    const body = undefined;

    // Act
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    // Assert
    const responseBody = await response.json();
    expect(response.status).toBe(400);
    expect(responseBody.validationErrors).toBeDefined();
    expect(responseBody.validationErrors.length).toEqual(2);
    expect(responseBody.validationErrors.filter((ve) => ve.field === 'email').length).toEqual(1);
    expect(responseBody.validationErrors.filter((ve) => ve.field === 'password').length).toEqual(1);
    expect(await Account.countDocuments({})).toEqual(0);
  });
});
