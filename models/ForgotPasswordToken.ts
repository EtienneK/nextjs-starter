import {
  Connection, Document, Model, Schema, SchemaDefinition,
} from 'mongoose';

export interface ForgotPasswordTokenInterface extends Document {
  token: string;
}

const schemaDefinition: SchemaDefinition = {
  token: { type: String, required: true, unique: true },
};

const modelName = 'ForgotPasswordToken';
const schema: Schema<ForgotPasswordTokenInterface> = new Schema<ForgotPasswordTokenInterface>(
  schemaDefinition, { timestamps: true },
);
schema.index({ createdAt: 1 }, {
  expireAfterSeconds: 1 * 24 * 60 * 60, // 1 day
});

const ForgotPasswordTokenModel = (conn: Connection): Model<ForgotPasswordTokenInterface> => (
  conn.models[modelName] ? conn.models[modelName] : conn.model(
    modelName,
    schema,
  ));

export default ForgotPasswordTokenModel;
