import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IInvoice extends Document {
  invoiceNumber: string;
  client: Types.ObjectId;
  service: string;
  amount: number;
  tax: number;
  total: number;
  currency: string;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: Date;
  paidAt?: Date;
  payment?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    service: { type: String, required: true },
    amount: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["Paid", "Pending", "Overdue"], default: "Pending", index: true },
    dueDate: { type: Date, required: true },
    paidAt: Date,
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
);

export default models.Invoice || model<IInvoice>("Invoice", InvoiceSchema);
