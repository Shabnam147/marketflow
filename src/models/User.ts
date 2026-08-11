import { Schema, model, models, type Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  passwordHash: string;
  role: "client" | "admin" | "employee";
  isEmailVerified: boolean;
  emailVerifyToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isDisabled: boolean;
  avatarUrl?: string;
  authProvider: "credentials" | "google";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true },
    companyName: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["client", "admin", "employee"], default: "client", index: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerifyToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    isDisabled: { type: Boolean, default: false },
    avatarUrl: { type: String },
    authProvider: { type: String, enum: ["credentials", "google"], default: "credentials" },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
