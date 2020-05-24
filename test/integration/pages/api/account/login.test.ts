import fetch from 'isomorphic-unfetch';
import { Model } from 'mongoose';
import setCookie from 'set-cookie-parser';

import handler from '../../../../../pages/api/account/login';
import AccountModel, { AccountInterface } from '../../../../../models/Account';
import { getMongooseConnection } from '../../../../../middlewares/mongoose-connection';
import ApiTestContext from '../ApiTestContext';

describe('Integration tests for: /api/account/login', () => {
  let ctx: ApiTestContext;
  let Account: Model<AccountInterface, {}>;

  beforeAll(async () => {
    ctx = new ApiTestContext();
    await ctx.init(handler);
    Account = AccountModel(await getMongooseConnection());
  });

  afterAll(async (done) => {
    await ctx.destroy(done);
  });

  beforeEach(async () => {
    await Account.deleteMany({});
  });

  const email = 'ME@EXAMPLE.COM';
  const password = 'password123';

  test('POST Should log the user in successfully', async () => {
    // Arrange
    const account = { email: email.toLowerCase(), password };
    await new Account(account).save();
    const body = JSON.stringify({ email, password });

    // Act
    const response = await fetch(ctx.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    // Assert
    expect(response.status).toBe(200);
    expect(await response.text()).toEqual('');
    expect(response.headers.get('set-cookie')).toContain('connect.sid=');
  });

  test('POST Should NOT log the user in if email does not exist', async () => {
    // Arrange
    const account = { email: email.toLowerCase(), password };
    await new Account(account).save();
    const body = JSON.stringify({ email: `wrong_${email}`, password });

    // Act
    const response = await fetch(ctx.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    // Assert
    expect(response.status).toBe(401);
    expect(await response.text()).toEqual('Unauthorized');
  });

  test('POST Should NOT log the user in if password is invalid', async () => {
    // Arrange
    const account = { email: email.toLowerCase(), password };
    await new Account(account).save();
    const body = JSON.stringify({ email, password: `wrong${password}` });

    // Act
    const response = await fetch(ctx.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    // Assert
    expect(response.status).toBe(401);
    expect(await response.text()).toEqual('Unauthorized');
  });

  test('DELETE Should log the user out successfully', async () => {
    // Arrange
    const account = { email: email.toLowerCase(), password };
    await new Account(account).save();
    const body = JSON.stringify({ email, password });

    const loginResponse = await fetch(ctx.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const combinedCookieHeader = loginResponse.headers.get('set-cookie');
    const splitCookieHeaders = setCookie.splitCookiesString(combinedCookieHeader);
    const cookies = setCookie.parse(splitCookieHeaders);

    // Act
    const response = await fetch(ctx.serverUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        cookie: `${cookies[0].name}=${cookies[0].value}`,
      },
      credentials: 'include',
    });

    // Assert
    expect(response.status).toBe(200);
    expect(await response.text()).toEqual('');
  });
});
