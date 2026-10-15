import mongoose, { Document, Schema } from 'mongoose';

export type EnquiryType =
  | 'Theatre / Exhibitor Partnership'
  | 'Film Distribution Proposal'
  | 'Producer / Film Submission'
  | 'Business Partnership'
  | 'General Enquiry';

export type EnquiryStatus = 'New' | 'In Progress' | 'Contacted' | 'Closed';

export interface IEnquiryNote {
  text: string;
  authorEmail: string;
  createdAt: Date;
}

export interface IEnquiry extends Document {
  referenceNumber: string;
  fullName: string;
  companyOrTheatre?: string;
  email: string;
  mobileNumber: string;
  enquiryType: EnquiryType;
  movieTitle?: string;
  territory?: string;
  message: string;
  status: EnquiryStatus;
  internalNotes: IEnquiryNote[];
  isSpam: boolean;
  assignedTo?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: 120,
    },
    companyOrTheatre: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
      index: true,
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      maxlength: 25,
    },
    enquiryType: {
      type: String,
      required: [true, 'Enquiry type is required'],
      enum: [
        'Theatre / Exhibitor Partnership',
        'Film Distribution Proposal',
        'Producer / Film Submission',
        'Business Partnership',
        'General Enquiry',
      ],
      index: true,
    },
    movieTitle: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    territory: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: 4000,
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Contacted', 'Closed'],
      default: 'New',
      index: true,
    },
    internalNotes: [
      {
        text: { type: String, required: true },
        authorEmail: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isSpam: {
      type: Boolean,
      default: false,
      index: true,
    },
    assignedTo: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

EnquirySchema.index({ status: 1, createdAt: -1 });

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
