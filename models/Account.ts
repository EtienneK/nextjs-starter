import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Connection, Document, Model, Schema, SchemaDefinition } from 'mongoose';

export interface IAccount extends Document {
  email: string;
  password: string;
  /**
   * Helper method for validating user's password.
   */
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  /**
   * Helper method for getting user's gravatar.
   */
  gravatar: (size: number) => URL;
}

const schema: SchemaDefinition = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

const name = 'account';
const accountSchema: Schema<IAccount> = new Schema<IAccount>(schema);

/**
 * Password hash middleware.
 */
accountSchema.pre<IAccount>('save', function save(next) {
  const account = this;
  if (!account.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(account.password, salt, (err, hash) => {
      if (err) { return next(err); }
      account.password = hash;
      next();
    });
  });
});

accountSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

accountSchema.methods.gravatar = function gravatar(size: number) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return new URL(`https://gravatar.com/avatar/?s=${size}&d=retro`);
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return new URL(`https://gravatar.com/avatar/${md5}?s=${size}&d=retro`);
};

const AccountModel = (conn: Connection): Model<IAccount> => conn.model(name, accountSchema);

export default AccountModel;
