import mongoose, { Model } from 'mongoose';

import AccountModel, { AccountInterface } from '../../../models/Account';

const Account: Model<AccountInterface> = AccountModel(mongoose.connection);

describe('Account Model', () => {
  it('passwords should match', async () => {
    // Arrange
    const account = new Account({
      email: 'me@example.com',
      password: '$2b$10$LhjJj5s1pLY/I4eCRaHaB.Fli8NBT8z1L8YF4/pmVU.5pERg4Z1AC',
    });

    // Act
    const matched = await account.comparePassword('root');

    // Assert
    expect(matched).toBeTruthy();
  });

  it('passwords should not match', async () => {
    // Arrange
    const account = new Account({
      email: 'me@example.com',
      password: '$2b$10$LhjJj5s1pLY/I4eCRaHaB.Fli8NBT8z1L8YF4/pmVU.5pERg4Z1AC',
    });

    // Act
    const matched = await account.comparePassword('not-root');

    // Assert
    expect(matched).toBeFalsy();
  });

  it('should generate gravatar without email and size', () => {
    const account = new Account();
    expect(account.gravatar().toString()).toContain('gravatar.com');
  });

  it('should generate gravatar with size', () => {
    const account = new Account();
    const size = 300;
    expect(account.gravatar(size).toString()).toContain(`s=${size}`);
  });

  it('should generate gravatar with email', () => {
    const account = new Account({ email: 'me@example.com' });
    const md5 = '2e0d5407ce8609047b8255c50405d7b1';
    expect(account.gravatar().toString()).toContain(md5);
  });
});
