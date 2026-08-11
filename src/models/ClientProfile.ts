import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IClientProfile extends Document {
  user: Types.ObjectId;
  website?: string;
  industry?: string;
  companyDescription?: string;
  targetAudience?: string;
  monthlyBudget?: number;
  marketingGoals: string[];
  selectedServices: string[];
  socialLinks: { platform: string; url: string }[];
  onboardingCompleted: boolean;
  onboardingStep: number;
  notificationPreferences: { email: boolean; inApp: boolean };
  createdAt: Date;
  updatedAt: Date;
}

const ClientProfileSchema = new Schema<IClientProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    website: String,
    industry: String,
    companyDescription: String,
    targetAudience: String,
    monthlyBudget: Number,
    marketingGoals: [{ type: String }],
    selectedServices: [{ type: String }],
    socialLinks: [{ platform: String, url: String }],
    onboardingCompleted: { type: Boolean, default: false },
    onboardingStep: { type: Number, default: 1 },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default models.ClientProfile || model<IClientProfile>("ClientProfile", ClientProfileSchema);
