import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  client: Types.ObjectId;
  service: Types.ObjectId;
  serviceRequest?: Types.ObjectId;
  startDate: Date;
  deadline?: Date;
  progress: number;
  status: "Not Started" | "In Progress" | "On Hold" | "Completed";
  assignedEmployees: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    serviceRequest: { type: Schema.Types.ObjectId, ref: "ServiceRequest" },
    startDate: { type: Date, required: true },
    deadline: Date,
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "On Hold", "Completed"],
      default: "Not Started",
    },
    assignedEmployees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default models.Project || model<IProject>("Project", ProjectSchema);
