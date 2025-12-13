import { Schema, model, Document, Model } from 'mongoose';
export type UserRole = 'user' | 'admin';

export interface UserAttributes {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserDocument extends UserAttributes, Document {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument, Model<UserDocument>>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user', required: true }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

const User = model<UserDocument>('User', userSchema);

export default User;
