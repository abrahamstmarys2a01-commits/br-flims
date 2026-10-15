import mongoose, { Document, Schema } from 'mongoose';

export interface IPageSection {
  title: string;
  content: string;
}

export interface IWebsitePage extends Document {
  slug: string; // e.g. 'privacy-policy', 'terms-of-use', 'about'
  title: string;
  subtitle?: string;
  content: string;
  sections?: IPageSection[];
  isPublished: boolean;
  lastUpdatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebsitePageSchema = new Schema<IWebsitePage>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    sections: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastUpdatedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const WebsitePage = mongoose.model<IWebsitePage>('WebsitePage', WebsitePageSchema);
