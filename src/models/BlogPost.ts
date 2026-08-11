import { Schema, model, models, type Document, type Types } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: Types.ObjectId;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: String,
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seoTitle: String,
    seoDescription: String,
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: Date,
  },
  { timestamps: true }
);

export default models.BlogPost || model<IBlogPost>("BlogPost", BlogPostSchema);
