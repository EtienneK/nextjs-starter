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
}

const schemaDefinition: SchemaDefinition = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

const modelName = 'Account';
const schema: Schema<AccountInterface> = new Schema<AccountInterface>(
  schemaDefinition, { timestamps: true },
);

schema.pre<AccountInterface>('save', async function save() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

schema.methods
  .comparePassword = async function comparePassword(candidatePassword): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  };

const AccountModel = (conn: Connection): Model<AccountInterface> => (
  conn.models[modelName] ? conn.models[modelName] : conn.model(
    modelName,
    schema,
  ));

export default AccountModel;
