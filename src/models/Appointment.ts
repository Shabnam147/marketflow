import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IAppointment extends Document {
  name: string;
  email: string;
  phone?: string;
  client?: Types.ObjectId;
  service?: string;
  date: Date;
  timeSlot: string;
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    client: { type: Schema.Types.ObjectId, ref: "User" },
    service: String,
    date: { type: Date, required: true, index: true },
    timeSlot: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Cancelled", "Completed"], default: "Pending" },
  },
  { timestamps: true }
);

// Prevent double-booking the same slot on the same day.
AppointmentSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

export default models.Appointment || model<IAppointment>("Appointment", AppointmentSchema);
