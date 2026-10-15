import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';
import { IEnquiry } from '../models/Enquiry.js';

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (ENV.SMTP_HOST && ENV.SMTP_USER && ENV.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: ENV.SMTP_HOST,
      port: ENV.SMTP_PORT,
      secure: ENV.SMTP_PORT === 465,
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
      },
    });
  }
  return transporter;
};

export const sendEnquiryNotificationEmail = async (
  enquiry: IEnquiry
): Promise<{ sent: boolean; message: string }> => {
  try {
    const activeTransporter = getTransporter();

    if (!activeTransporter) {
      console.log(
        `[Email Notification Simulation] SMTP credentials not configured. Enquiry [${enquiry.referenceNumber}] from ${enquiry.fullName} (${enquiry.email}) received successfully and logged.`
      );
      return {
        sent: false,
        message: 'SMTP credentials not configured. Enquiry recorded in MongoDB for administrative review.',
      };
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #252525; max-width: 600px; margin: 0 auto; border: 1px solid #E8E8EC; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #C6283D; padding: 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">New Business Enquiry</h1>
          <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Ref: ${enquiry.referenceNumber}</p>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #686868; width: 140px;"><strong>Client Name:</strong></td><td>${enquiry.fullName}</td></tr>
            <tr><td style="padding: 8px 0; color: #686868;"><strong>Company / Theatre:</strong></td><td>${enquiry.companyOrTheatre || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #686868;"><strong>Email:</strong></td><td><a href="mailto:${enquiry.email}">${enquiry.email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #686868;"><strong>Mobile:</strong></td><td>${enquiry.mobileNumber}</td></tr>
            <tr><td style="padding: 8px 0; color: #686868;"><strong>Enquiry Type:</strong></td><td>${enquiry.enquiryType}</td></tr>
            ${enquiry.movieTitle ? `<tr><td style="padding: 8px 0; color: #686868;"><strong>Movie Title:</strong></td><td>${enquiry.movieTitle}</td></tr>` : ''}
            ${enquiry.territory ? `<tr><td style="padding: 8px 0; color: #686868;"><strong>Territory:</strong></td><td>${enquiry.territory}</td></tr>` : ''}
          </table>
          <hr style="border: 0; border-top: 1px solid #E8E8EC; margin: 20px 0;" />
          <h3 style="margin-top: 0; font-size: 15px; color: #252525;">Message:</h3>
          <p style="background: #F7F7F8; padding: 14px; border-radius: 6px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${enquiry.message}</p>
          <div style="margin-top: 24px; text-align: center;">
            <a href="${ENV.CLIENT_URL}/admin/enquiries" style="display: inline-block; background-color: #C6283D; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
              Open in Admin Portal
            </a>
          </div>
        </div>
      </div>
    `;

    await activeTransporter.sendMail({
      from: `"BR Films Portal" <${ENV.SMTP_USER}>`,
      to: ENV.NOTIFY_EMAIL,
      subject: `[BR Films Enquiry] ${enquiry.enquiryType} - ${enquiry.fullName} (${enquiry.referenceNumber})`,
      html: htmlContent,
    });

    console.log(`[Email Notification] Email sent successfully for enquiry ${enquiry.referenceNumber}`);
    return { sent: true, message: 'Notification email dispatched to administrator.' };
  } catch (error: any) {
    console.error(`[Email Notification Error] Could not send email for enquiry ${enquiry.referenceNumber}:`, error.message);
    return { sent: false, message: `Notification delivery failed: ${error.message}` };
  }
};
