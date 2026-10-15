import { z } from 'zod';

export const createEnquirySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters long').max(120).trim(),
  companyOrTheatre: z.string().max(150).trim().optional(),
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
  mobileNumber: z
    .string()
    .min(7, 'Mobile number must be at least 7 digits')
    .max(25)
    .regex(/^[+0-9\s\-()]+$/, 'Please enter a valid mobile number')
    .trim(),
  enquiryType: z.enum([
    'Theatre / Exhibitor Partnership',
    'Film Distribution Proposal',
    'Producer / Film Submission',
    'Business Partnership',
    'General Enquiry',
  ]),
  movieTitle: z.string().max(200).trim().optional(),
  territory: z.string().max(100).trim().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(4000).trim(),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(['New', 'In Progress', 'Contacted', 'Closed']),
  assignedTo: z.string().trim().optional(),
  isSpam: z.boolean().optional(),
});

export const addEnquiryNoteSchema = z.object({
  text: z.string().min(1, 'Note text cannot be empty').max(2000).trim(),
});
