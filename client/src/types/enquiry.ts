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
  createdAt: string;
}

export interface IEnquiry {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnquiryInput {
  fullName: string;
  companyOrTheatre?: string;
  email: string;
  mobileNumber: string;
  enquiryType: EnquiryType;
  movieTitle?: string;
  territory?: string;
  message: string;
}
