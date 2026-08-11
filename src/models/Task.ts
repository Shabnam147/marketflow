import { Schema, model, models, type Document, type Types } from "mongoose";

export interface ITask extends Document {
  project: Types.ObjectId;
  title: string;
  isCompleted: boolean;
  order: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    completedAt: Date,
  },
  { timestamps: true }
);

export default models.Task || model<ITask>("Task", TaskSchema);
