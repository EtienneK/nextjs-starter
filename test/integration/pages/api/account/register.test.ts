import fetch from 'isomorphic-unfetch';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';

import handler from '../../../../../pages/api/account/register';
import AccountModel, { AccountInterface } from '../../../../../models/Account';
import { getMongooseConnection } from '../../../../../middlewares/mongoose-connection';
import ApiTestContext from '../ApiTestContext';

describe('Integration tests for: /api/account/register', () => {
  let ctx: ApiTestContext;
  let Account: Model<AccountInterface, unknown>;

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

  test('POST Should create a new account successfully', async () => {
    // Arrange
    const body = JSON.stringify({ email, password, confirmPassword: password });

    // Act
    const response = await fetch(ctx.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    // Assert
    expect(response.status).toBe(201);
    const foundAccount = await Account.findOne({ email: email.toLowerCase() });
    expect(foundAccount.email).toEqual(email.toLowerCase());
    expect(await bcrypt.compare(password, foundAccount.password)).toBeTruthy();
    expect(await response.json()).toEqual({ id: foundAccount.id, email: email.toLowerCase() });
    expect(await Account.countDocuments({})).toEqual(1);
  });

  test('POST Should return 400 with validation errors if no body is sent', async () => {
    // Arrange
    const body = undefined;

    // Act
    const response = await fetch(ctx.serverUrl, {
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
    const emailErrors = responseBody.validationErrors.filter((ve) => ve.field === 'email');
    expect(emailErrors.length).toEqual(1);
    expect(emailErrors[0].message).toBeDefined();
    const passwordErrors = responseBody.validationErrors.filter((ve) => ve.field === 'password');
    expect(passwordErrors.length).toEqual(1);
    expect(passwordErrors[0].message).toBeDefined();
    expect(await Account.countDocuments({})).toEqual(0);
  });

  test('POST Should return 400 with validation error if invalid email is sent', async () => {
    // Arrange
    const body = JSON.stringify({ email: 'not@valid', password, confirmPassword: password });

    // Act
    const response = await fetch(ctx.serverUrl, {
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
    expect(responseBody.validationErrors.length).toEqual(1);
    const emailErrors = responseBody.validationErrors.filter((ve) => ve.field === 'email');
    expect(emailErrors.length).toEqual(1);
    expect(emailErrors[0].message).toContain('valid email');
    expect(await Account.countDocuments({})).toEqual(0);
  });

  test('POST Should return 400 with validation error if email alreasy exists', async () => {
    // Arrange
    const account = { email: email.toLowerCase(), password };
    await new Account(account).save();
    const body = JSON.stringify({ ...account, confirmPassword: password });

    // Act
    const response = await fetch(ctx.serverUrl, {
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
    expect(responseBody.validationErrors.length).toEqual(1);
    const emailErrors = responseBody.validationErrors.filter((ve) => ve.field === 'email');
    expect(emailErrors.length).toEqual(1);
    expect(emailErrors[0].message).toContain('already exists');
    expect(await Account.countDocuments({})).toEqual(1);
  });

  test('POST Should return 400 with validation errors if password is less than 8 characters in length', async () => {
    // Arrange
    const body = JSON.stringify({ email, password: '1234567', confirmPassword: '1234567' });

    // Act
    const response = await fetch(ctx.serverUrl, {
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
    expect(responseBody.validationErrors.length).toEqual(1);
    const passwordErrors = responseBody.validationErrors.filter((ve) => ve.field === 'password');
    expect(passwordErrors.length).toEqual(1);
    expect(passwordErrors[0].message).toContain('length');
    expect(await Account.countDocuments({})).toEqual(0);
  });

  test('POST Should return 400 with validation errors if password and confirmPassword do not match', async () => {
    // Arrange
    const body = JSON.stringify({ email, password, confirmPassword: `${password}1` });

    // Act
    const response = await fetch(ctx.serverUrl, {
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
    expect(responseBody.validationErrors.length).toEqual(1);
    const confirmPasswordErrors = responseBody.validationErrors.filter((ve) => ve.field === 'confirmPassword');
    expect(confirmPasswordErrors.length).toEqual(1);
    expect(confirmPasswordErrors[0].message).toContain('match');
    expect(await Account.countDocuments({})).toEqual(0);
  });
});
