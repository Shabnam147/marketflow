import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IMarketingReport extends Document {
  client: Types.ObjectId;
  month: string; // e.g. "2026-07"
  websiteVisitors: number;
  leads: number;
  conversionRate: number;
  socialFollowers: number;
  engagementRate: number;
  adSpend: number;
  revenue: number;
  roas: number;
  seoTraffic: number;
  keywordRankings: { keyword: string; position: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const MarketingReportSchema = new Schema<IMarketingReport>(
  {
    client: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    month: { type: String, required: true },
    websiteVisitors: Number,
    leads: Number,
    conversionRate: Number,
    socialFollowers: Number,
    engagementRate: Number,
    adSpend: Number,
    revenue: Number,
    roas: Number,
    seoTraffic: Number,
    keywordRankings: [{ keyword: String, position: Number }],
  },
  { timestamps: true }
);

MarketingReportSchema.index({ client: 1, month: 1 }, { unique: true });

export default models.MarketingReport || model<IMarketingReport>("MarketingReport", MarketingReportSchema);
