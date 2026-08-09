import { Schema, model, models, type Document } from "mongoose";

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  serviceRequired?: string;
  budget?: string;
  message: string;
  createdAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    website: String,
    serviceRequired: String,
    budget: String,
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.ContactSubmission || model<IContactSubmission>("ContactSubmission", ContactSubmissionSchema);
