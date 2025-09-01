import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface ISession extends Document {
  userId: Schema.Types.ObjectId;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastAccessedAt: Date;
}

const SessionSchema: Schema<ISession> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastAccessedAt: { type: Date, default: Date.now },
});

const SessionModel: Model<ISession> = models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default SessionModel;
