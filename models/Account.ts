import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  Connection, Document, Model, Schema, SchemaDefinition,
} from 'mongoose';

export interface AccountInterface extends Document {
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
const accountSchema: Schema<AccountInterface> = new Schema<AccountInterface>(schema);

accountSchema.pre<AccountInterface>('save', async function save() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

accountSchema.methods
  .comparePassword = async function comparePassword(candidatePassword): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  };

accountSchema.methods.gravatar = function gravatar(size = 200): URL {
  if (!this.email) return new URL(`https://gravatar.com/avatar/?s=${size}&d=retro`);
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return new URL(`https://gravatar.com/avatar/${md5}?s=${size}&d=retro`);
};

const AccountModel = (conn: Connection): Model<AccountInterface> => conn.model(name, accountSchema);

export default AccountModel;
