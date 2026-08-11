import { Schema, model, models, type Document, type Types } from "mongoose";

export const SERVICE_REQUEST_STATUSES = [
  "Pending",
  "Reviewed",
  "Proposal Sent",
  "Approved",
  "In Progress",
  "Completed",
] as const;

export interface IServiceRequest extends Document {
  client: Types.ObjectId;
  service: Types.ObjectId;
  businessName: string;
  website?: string;
  targetAudience?: string;
  platforms: string[];
  goals: string[];
  monthlyBudget?: number;
  additionalInfo?: string;
  attachments: { url: string; filename: string }[];
  status: (typeof SERVICE_REQUEST_STATUSES)[number];
  statusHistory: { status: string; changedAt: Date; note?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceRequestSchema = new Schema<IServiceRequest>(
  {
    client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    businessName: { type: String, required: true },
    website: String,
    targetAudience: String,
    platforms: [{ type: String }],
    goals: [{ type: String }],
    monthlyBudget: Number,
    additionalInfo: String,
    attachments: [{ url: String, filename: String }],
    status: { type: String, enum: SERVICE_REQUEST_STATUSES, default: "Pending", index: true },
    statusHistory: [
      { status: String, changedAt: { type: Date, default: Date.now }, note: String },
    ],
  },
  { timestamps: true }
);

export default models.ServiceRequest || model<IServiceRequest>("ServiceRequest", ServiceRequestSchema);
