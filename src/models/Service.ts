import { Schema, model, models, type Document } from "mongoose";

export interface IService extends Document {
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  features: string[];
  benefits: string[];
  deliverables: string[];
  startingPrice: number;
  currency: string;
  faqs: { question: string; answer: string }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    benefits: [{ type: String }],
    deliverables: [{ type: String }],
    startingPrice: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    faqs: [{ question: String, answer: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Service || model<IService>("Service", ServiceSchema);
