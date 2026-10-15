import { Request, Response } from 'express';
import { Enquiry } from '../models/Enquiry.js';
import { SiteSetting } from '../models/SiteSetting.js';
import { AuthRequest } from '../middlewares/auth.js';
import { recordAuditLog } from '../services/auditService.js';
import { sendEnquiryNotificationEmail } from '../services/emailService.js';

// Generate human-friendly reference number
const generateReferenceNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  let isUnique = false;
  let ref = '';

  while (!isUnique) {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    ref = `BRF-${currentYear}-${randomHex}`;
    const existing = await Enquiry.findOne({ referenceNumber: ref });
    if (!existing) {
      isUnique = true;
    }
  }
  return ref;
};

// ================= PUBLIC SUBMISSION =================

export const submitEnquiry = async (req: Request, res: Response): Promise<void> => {
  const referenceNumber = await generateReferenceNumber();

  const enquiry = await Enquiry.create({
    ...req.body,
    referenceNumber,
    ipAddress: req.ip,
  });

  // Attempt transactional notification email
  const emailResult = await sendEnquiryNotificationEmail(enquiry);

  // Retrieve official WhatsApp number for direct chat redirection option
  const settings = await SiteSetting.findOne();
  const whatsappNumber = (settings?.whatsappBusinessNumber || '+919842416662').replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    `Hello BR Films team, I have submitted an enquiry on your portal (Reference: ${referenceNumber}) regarding ${enquiry.enquiryType}.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out to BR Films. Your enquiry has been registered successfully.',
    referenceNumber,
    whatsappUrl,
    notificationStatus: emailResult.message,
  });
};

// ================= ADMIN MANAGEMENT =================

export const getAdminEnquiries = async (req: AuthRequest, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const { search, status, enquiryType, isSpam } = req.query;
  const query: any = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (enquiryType && enquiryType !== 'all') {
    query.enquiryType = enquiryType;
  }

  if (isSpam !== undefined) {
    query.isSpam = isSpam === 'true';
  } else {
    // By default, exclude marked spam
    query.isSpam = false;
  }

  if (search) {
    query.$or = [
      { fullName: { $regex: search as string, $options: 'i' } },
      { email: { $regex: search as string, $options: 'i' } },
      { referenceNumber: { $regex: search as string, $options: 'i' } },
      { companyOrTheatre: { $regex: search as string, $options: 'i' } },
      { movieTitle: { $regex: search as string, $options: 'i' } },
    ];
  }

  const [enquiries, total] = await Promise.all([
    Enquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Enquiry.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: enquiries,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
};

export const getAdminEnquiryById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const enquiry = await Enquiry.findById(id).lean();

  if (!enquiry) {
    res.status(404).json({
      success: false,
      message: 'Enquiry not found.',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: enquiry,
  });
};

export const updateEnquiryStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, assignedTo, isSpam } = req.body;

  const enquiry = await Enquiry.findById(id);
  if (!enquiry) {
    res.status(404).json({
      success: false,
      message: 'Enquiry not found.',
    });
    return;
  }

  const oldStatus = enquiry.status;
  if (status !== undefined) enquiry.status = status;
  if (assignedTo !== undefined) enquiry.assignedTo = assignedTo;
  if (isSpam !== undefined) enquiry.isSpam = isSpam;

  await enquiry.save();

  await recordAuditLog({
    actorId: req.user?._id.toString(),
    actorEmail: req.user?.email || 'admin',
    action: 'ENQUIRY_UPDATED',
    entityType: 'Enquiry',
    entityId: id,
    details: {
      referenceNumber: enquiry.referenceNumber,
      fromStatus: oldStatus,
      toStatus: enquiry.status,
      isSpam: enquiry.isSpam,
    },
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: 'Enquiry updated successfully.',
    data: enquiry,
  });
};

export const addEnquiryNote = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { text } = req.body;

  const enquiry = await Enquiry.findById(id);
  if (!enquiry) {
    res.status(404).json({
      success: false,
      message: 'Enquiry not found.',
    });
    return;
  }

  enquiry.internalNotes.push({
    text,
    authorEmail: req.user?.email || 'admin',
    createdAt: new Date(),
  });

  await enquiry.save();

  await recordAuditLog({
    actorId: req.user?._id.toString(),
    actorEmail: req.user?.email || 'admin',
    action: 'ENQUIRY_NOTE_ADDED',
    entityType: 'Enquiry',
    entityId: id,
    details: { referenceNumber: enquiry.referenceNumber },
    ipAddress: req.ip,
  });

  res.status(200).json({
    success: true,
    message: 'Internal note added successfully.',
    data: enquiry,
  });
};

export const exportEnquiriesToCsv = async (_req: AuthRequest, res: Response): Promise<void> => {
  const enquiries = await Enquiry.find({ isSpam: false }).sort({ createdAt: -1 }).lean();

  const headers = [
    'Reference Number',
    'Full Name',
    'Company/Theatre',
    'Email',
    'Mobile',
    'Type',
    'Movie Title',
    'Territory',
    'Status',
    'Submitted At',
  ];

  const escapeCsv = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;

  const rows = enquiries.map((e) =>
    [
      escapeCsv(e.referenceNumber),
      escapeCsv(e.fullName),
      escapeCsv(e.companyOrTheatre),
      escapeCsv(e.email),
      escapeCsv(e.mobileNumber),
      escapeCsv(e.enquiryType),
      escapeCsv(e.movieTitle),
      escapeCsv(e.territory),
      escapeCsv(e.status),
      escapeCsv(new Date(e.createdAt).toISOString()),
    ].join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="br-films-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`
  );
  res.status(200).send(csvContent);
};
