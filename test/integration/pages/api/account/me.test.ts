import fetch from 'isomorphic-unfetch';
import { Model } from 'mongoose';

import handler from '../../../../../pages/api/account/me';
import AccountModel, { AccountInterface } from '../../../../../models/Account';
import { getMongooseConnection } from '../../../../../middlewares/mongoose-connection';
import ApiTestContext from '../ApiTestContext';
import { login } from '../helpers';

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

  const email = 'me@example.com';
  const password = 'password123';

  test('GET Should get the logged-in account successfully', async () => {
    // Arrange
    const account = await new Account({ email, password }).save();
    const cookie = await login(ctx.serverUrl, { email, password });

    // Act
    const response = await fetch(ctx.serverUrl, {
      headers: {
        'Content-Type': 'application/json',
        cookie,
      },
    });

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      id: account.id,
    });
  });

  test('GET Should NOT get the non-logged-in account', async () => {
    // Arrange

    // Act
    const response = await fetch(ctx.serverUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Assert
    expect(response.status).toBe(401);
    expect(await response.text()).toEqual('');
  });
});
