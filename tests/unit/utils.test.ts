import { describe, it, expect } from "vitest";
import { formatCurrency, formatPhone, slugify, getTimeRemaining } from "../../src/lib/utils";

describe("Utility Functions", () => {
  describe("formatCurrency", () => {
    it("converts minor units (cents) to standard ETB format", () => {
      expect(formatCurrency(100)).toBe("1.00 ETB");
      expect(formatCurrency(150000)).toBe("1,500.00 ETB");
      expect(formatCurrency(0)).toBe("0.00 ETB");
      expect(formatCurrency(50)).toBe("0.50 ETB");
    });
  });

  describe("formatPhone", () => {
    it("normalizes Ethiopian numbers starting with 09 to +251", () => {
      expect(formatPhone("0911234567")).toBe("+251911234567");
    });

    it("normalizes Ethiopian numbers starting with 9 to +251", () => {
      expect(formatPhone("911234567")).toBe("+251911234567");
    });

    it("preserves already normalized +251 numbers", () => {
      expect(formatPhone("+251911234567")).toBe("+251911234567");
    });

    it("handles spaces and dashes gracefully", () => {
      expect(formatPhone("0911-23 45 67")).toBe("+251911234567");
    });
  });

  describe("slugify", () => {
    it("creates URL-safe slugs", () => {
      expect(slugify("iPhone 16 Pro Max 256GB")).toBe("iphone-16-pro-max-256gb");
      expect(slugify("PlayStation 5 Pro & Accessories!")).toBe("playstation-5-pro-accessories");
    });
  });

  describe("getTimeRemaining", () => {
    it("calculates time remaining correctly for future date", () => {
      const future = new Date(Date.now() + 3600000 + 60000); // 1 hr 1 min
      const res = getTimeRemaining(future);
      expect(res.expired).toBe(false);
      expect(res.hours).toBe(1);
    });

    it("detects expired countdown", () => {
      const past = new Date(Date.now() - 1000);
      const res = getTimeRemaining(past);
      expect(res.expired).toBe(true);
    });
  });
});
