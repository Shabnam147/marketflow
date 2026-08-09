import { Schema, model, models, type Document, type Types } from "mongoose";

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"] as const;

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: "Contact Form" | "Consultation Booking" | "Website Form" | "Manual Entry" | "Free Tool";
  serviceInterested?: string;
  status: (typeof LEAD_STATUSES)[number];
  estimatedValue?: number;
  notes: { text: string; addedBy?: Types.ObjectId; addedAt: Date }[];
  assignedEmployee?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phone: String,
    company: String,
    source: {
      type: String,
      enum: ["Contact Form", "Consultation Booking", "Website Form", "Manual Entry", "Free Tool"],
      default: "Contact Form",
    },
    serviceInterested: String,
    status: { type: String, enum: LEAD_STATUSES, default: "New", index: true },
    estimatedValue: Number,
    notes: [{ text: String, addedBy: { type: Schema.Types.ObjectId, ref: "User" }, addedAt: { type: Date, default: Date.now } }],
    assignedEmployee: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default models.Lead || model<ILead>("Lead", LeadSchema);
