import nodemailer, { type Transporter } from "nodemailer";
import { config } from "../config";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;
  if (config.mail.enabled) {
    transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.port === 465,
      auth: { user: config.mail.user, pass: config.mail.pass },
    });
  } else {
    // No SMTP configured — log the message instead of sending.
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
  return transporter;
}

export interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}

export async function sendMail(opts: MailOptions): Promise<void> {
  const info = await getTransporter().sendMail({
    from: config.mail.from,
    ...opts,
  });
  if (!config.mail.enabled) {
    // Surface in logs during local/dev so receipts are observable.
    console.log(`[email:dev] →${opts.to} :: ${opts.subject}`);
  }
  return void info;
}

export async function sendReceiptEmail(
  to: string,
  donorName: string,
  amount: number,
  receiptNo: string,
  pdf: Buffer
): Promise<void> {
  await sendMail({
    to,
    subject: `Your 80G donation receipt (${receiptNo}) — Akshaya Vidya Foundation`,
    text:
      `Dear ${donorName},\n\nThank you for your generous donation of ` +
      `INR ${amount.toLocaleString("en-IN")}. Your 80G tax receipt ` +
      `(${receiptNo}) is attached.\n\nWith gratitude,\nAkshaya Vidya Foundation`,
    attachments: [
      {
        filename: `AVF-Receipt-${receiptNo}.pdf`,
        content: pdf,
        contentType: "application/pdf",
      },
    ],
  });
}

export async function sendVolunteerAck(
  to: string,
  name: string
): Promise<void> {
  await sendMail({
    to,
    subject: "Welcome aboard — Akshaya Vidya Foundation",
    text:
      `Dear ${name},\n\nThank you for registering as a volunteer with ` +
      `Akshaya Vidya Foundation. Our coordinator will reach out shortly ` +
      `with next steps.\n\nWarm regards,\nAVF Volunteer Team`,
  });
}
