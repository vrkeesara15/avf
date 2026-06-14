/** Shared validators (NFR-A05 — clear validation, DON-05 — PAN capture). */

export const isEmail = (v: string) =>
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());

// Indian mobile number: 10 digits, optionally +91 / leading 0.
export const isPhone = (v: string) =>
  /^(\+?91[-\s]?|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ""));

// PAN format: 5 letters, 4 digits, 1 letter (mandatory for 80G receipts).
export const isPAN = (v: string) =>
  /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.trim().toUpperCase());

export const required = (v: string) => v.trim().length > 0;

export type Errors<T> = Partial<Record<keyof T, string>>;
