import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IAudit extends Document {
  url: string;
  requestedBy?: Types.ObjectId;
  email?: string;
  httpStatus?: number;
  hasHttps: boolean;
  pageTitle?: string;
  metaDescription?: string;
  h1Count: number;
  hasMobileViewport: boolean;
  imagesMissingAlt: number;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  loadTimeMs?: number;
  scores: {
    seo: number;
    performance: number;
    technicalSeo: number;
    content: number;
  };
  recommendations: string[];
  createdAt: Date;
}

const AuditSchema = new Schema<IAudit>(
  {
    url: { type: String, required: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User" },
    email: String,
    httpStatus: Number,
    hasHttps: Boolean,
    pageTitle: String,
    metaDescription: String,
    h1Count: Number,
    hasMobileViewport: Boolean,
    imagesMissingAlt: Number,
    hasRobotsTxt: Boolean,
    hasSitemap: Boolean,
    loadTimeMs: Number,
    scores: {
      seo: Number,
      performance: Number,
      technicalSeo: Number,
      content: Number,
    },
    recommendations: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.Audit || model<IAudit>("Audit", AuditSchema);
