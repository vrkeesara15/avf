import { describe, it, expect } from "vitest";
import { isEmail, isPhone, isPAN, required } from "./validation";

describe("validation helpers", () => {
  it("validates email addresses", () => {
    expect(isEmail("a@b.com")).toBe(true);
    expect(isEmail("first.last@sub.domain.org")).toBe(true);
    expect(isEmail("no-at-sign")).toBe(false);
    expect(isEmail("missing@domain")).toBe(false);
    expect(isEmail("")).toBe(false);
  });

  it("validates Indian mobile numbers", () => {
    expect(isPhone("9876543210")).toBe(true);
    expect(isPhone("+91 98765 43210")).toBe(true);
    expect(isPhone("098765-43210")).toBe(true);
    expect(isPhone("12345")).toBe(false); // too short
    expect(isPhone("1234567890")).toBe(false); // can't start with 1
  });

  it("validates PAN numbers (required for 80G)", () => {
    expect(isPAN("ABCDE1234F")).toBe(true);
    expect(isPAN("abcde1234f")).toBe(true); // case-insensitive
    expect(isPAN("ABCD1234F")).toBe(false); // too few letters
    expect(isPAN("ABCDE12345")).toBe(false); // wrong shape
  });

  it("checks required (non-blank) values", () => {
    expect(required("hello")).toBe(true);
    expect(required("   ")).toBe(false);
    expect(required("")).toBe(false);
  });
});
