import {
  Connection, Document, Model, Schema, SchemaDefinition,
} from 'mongoose';

export interface ForgotPasswordTokenInterface extends Document {
  token: string;
  accountId: string;
}

const schemaDefinition: SchemaDefinition = {
  token: { type: String, required: true, unique: true },
  accountId: { type: String, required: true, unique: true },
};

const modelName = 'ForgotPasswordToken';
const schema: Schema<ForgotPasswordTokenInterface> = new Schema<ForgotPasswordTokenInterface>(
  schemaDefinition, { timestamps: true },
);
schema.index({ createdAt: 1 }, {
  expireAfterSeconds: 30 * 60, // 30 minutes
});

const ForgotPasswordTokenModel = (conn: Connection): Model<ForgotPasswordTokenInterface> => (
  conn.models[modelName] ? conn.models[modelName] : conn.model(
    modelName,
    schema,
  ));

export default ForgotPasswordTokenModel;
