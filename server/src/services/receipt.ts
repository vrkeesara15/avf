import PDFDocument from "pdfkit";
import type { Donation } from "../types";

const ORG = {
  name: "Akshaya Vidya Foundation",
  address: "Nandanavanam, LB Nagar, Hyderabad, Telangana 500074, India",
  reg80G: "AAATA1234F20214",
  cin: "U85300TG2013NPL089123",
  pan: "AAATA1234F",
};

function rupeesInWords(n: number): string {
  // Compact Indian-system number-to-words for receipt amounts.
  if (n === 0) return "Zero";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
    "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy",
    "Eighty", "Ninety",
  ];
  const two = (x: number): string =>
    x < 20 ? ones[x] : `${tens[Math.floor(x / 10)]}${x % 10 ? " " + ones[x % 10] : ""}`;
  const three = (x: number): string =>
    x >= 100
      ? `${ones[Math.floor(x / 100)]} Hundred${x % 100 ? " " + two(x % 100) : ""}`
      : two(x);

  let result = "";
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  if (crore) result += `${three(crore)} Crore `;
  if (lakh) result += `${two(lakh)} Lakh `;
  if (thousand) result += `${two(thousand)} Thousand `;
  if (n) result += three(n);
  return result.trim();
}

/**
 * Generate an 80G-compliant donation receipt PDF (DON-06).
 * Returns the PDF as a Buffer so it can be emailed or streamed.
 */
export function generateReceiptPdf(donation: Donation): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc.fillColor("#1b4f8a").fontSize(20).text(ORG.name, { align: "center" });
    doc
      .fillColor("#647689")
      .fontSize(10)
      .text(ORG.address, { align: "center" });
    doc.moveDown(0.5);
    doc
      .fillColor("#16263a")
      .fontSize(14)
      .text("80G Donation Receipt", { align: "center" });
    doc
      .moveTo(50, doc.y + 6)
      .lineTo(545, doc.y + 6)
      .strokeColor("#e4e9ef")
      .stroke();
    doc.moveDown(1.5);

    const row = (label: string, value: string) => {
      doc.fillColor("#647689").fontSize(10).text(label, 60, doc.y, {
        continued: true,
        width: 180,
      });
      doc.fillColor("#16263a").fontSize(11).text(value);
      doc.moveDown(0.4);
    };

    row("Receipt No:", donation.receiptNo ?? "—");
    row("Date:", new Date(donation.paidAt ?? donation.createdAt).toLocaleString("en-IN"));
    row("Donor Name:", donation.donorName ?? "—");
    row("PAN:", donation.pan ?? "—");
    row("City:", donation.city ?? "—");
    row("Transaction ID:", donation.razorpayPaymentId ?? "—");
    row("Payment Mode:", "Online (Razorpay)");
    row("Frequency:", donation.frequency);
    doc.moveDown(0.5);

    doc
      .fillColor("#16263a")
      .fontSize(14)
      .text(`Amount: INR ${donation.amount.toLocaleString("en-IN")}/-`, 60);
    doc
      .fillColor("#647689")
      .fontSize(10)
      .text(`(Rupees ${rupeesInWords(donation.amount)} Only)`, 60);
    doc.moveDown(1.5);

    doc
      .fillColor("#3c4d60")
      .fontSize(9)
      .text(
        `This receipt is issued for a voluntary donation and is eligible for ` +
          `deduction under Section 80G of the Income Tax Act, 1961.`,
        60,
        doc.y,
        { width: 470 }
      );
    doc.moveDown(0.8);
    row("80G Registration No:", ORG.reg80G);
    row("PAN of Trust:", ORG.pan);
    row("CIN:", ORG.cin);

    doc.moveDown(2);
    doc
      .fillColor("#647689")
      .fontSize(9)
      .text("Thank you for supporting Akshaya Vidya Foundation.", {
        align: "center",
      });
    doc.text("This is a system-generated receipt.", { align: "center" });

    doc.end();
  });
}
