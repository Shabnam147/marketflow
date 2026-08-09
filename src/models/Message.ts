import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IMessage extends Document {
  conversationId: string;
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  body: string;
  attachments: { url: string; filename: string }[];
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: String, required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    attachments: [{ url: String, filename: String }],
    readAt: Date,
  },
  { timestamps: true }
);

export default models.Message || model<IMessage>("Message", MessageSchema);
