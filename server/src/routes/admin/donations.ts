import { Router } from "express";
import { getStore } from "../../store";
import { asyncHandler } from "../../lib/http";
import { requireRole } from "../../auth/middleware";
import { audit } from "../../lib/audit";
import type { Donation } from "../../types";

export const adminDonationsRouter = Router();

// ADM-03 — donation_viewer (and super_admin) can view donation records.
adminDonationsRouter.use(requireRole("donation_viewer"));

adminDonationsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const donations = await getStore().list<Donation>("donations", {
      orderBy: "createdAt",
      direction: "desc",
    });
    res.json(donations);
  })
);

adminDonationsRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const donations = await getStore().list<Donation>("donations");
    const paid = donations.filter((d) => d.status === "paid");
    const total = paid.reduce((sum, d) => sum + d.amount, 0);
    const now = new Date();
    const thisMonth = paid.filter((d) => {
      const dt = new Date(d.paidAt ?? d.createdAt);
      return (
        dt.getMonth() === now.getMonth() &&
        dt.getFullYear() === now.getFullYear()
      );
    });
    res.json({
      totalRaised: total,
      totalDonations: paid.length,
      monthRaised: thisMonth.reduce((s, d) => s + d.amount, 0),
      monthDonations: thisMonth.length,
      pendingReceipts: paid.filter((d) => !d.receiptEmailed).length,
    });
  })
);

// ADM-03 — export to CSV.
adminDonationsRouter.get(
  "/export.csv",
  asyncHandler(async (req, res) => {
    const donations = await getStore().list<Donation>("donations", {
      orderBy: "createdAt",
      direction: "desc",
    });
    const header = [
      "Receipt No",
      "Date",
      "Donor",
      "Email",
      "Phone",
      "PAN",
      "City",
      "Amount",
      "Frequency",
      "Status",
      "Transaction ID",
    ];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = donations.map((d) =>
      [
        d.receiptNo,
        d.paidAt ?? d.createdAt,
        d.donorName,
        d.email,
        d.phone,
        d.pan,
        d.city,
        d.amount,
        d.frequency,
        d.status,
        d.razorpayPaymentId,
      ]
        .map(escape)
        .join(",")
    );
    const csv = [header.map(escape).join(","), ...rows].join("\n");
    await audit(req, "export_donations_csv");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="avf-donations.csv"'
    );
    res.send(csv);
  })
);
