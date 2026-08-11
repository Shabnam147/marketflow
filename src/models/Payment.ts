import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IPayment extends Document {
  client: Types.ObjectId;
  invoice?: Types.ObjectId;
  provider: "stripe" | "razorpay";
  providerPaymentId: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}

// NOTE: Card details are never stored here. Only the payment provider's
// reference ID and status are persisted; card data stays with Stripe/Razorpay.
const PaymentSchema = new Schema<IPayment>(
  {
    client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    invoice: { type: Schema.Types.ObjectId, ref: "Invoice" },
    provider: { type: String, enum: ["stripe", "razorpay"], required: true },
    providerPaymentId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["succeeded", "pending", "failed", "refunded"], default: "pending" },
  },
  { timestamps: true }
);

export default models.Payment || model<IPayment>("Payment", PaymentSchema);
