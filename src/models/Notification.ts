import { Schema, model, models, type Document, type Types } from "mongoose";

export const NOTIFICATION_TYPES = [
  "new_message",
  "new_project",
  "project_update",
  "invoice_generated",
  "payment_received",
  "appointment_booked",
  "report_uploaded",
  "service_request_status_changed",
] as const;

export interface INotification extends Document {
  user: Types.ObjectId;
  type: (typeof NOTIFICATION_TYPES)[number];
  title: string;
  body: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    link: String,
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.Notification || model<INotification>("Notification", NotificationSchema);
