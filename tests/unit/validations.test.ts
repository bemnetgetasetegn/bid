import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  topUpSchema,
  bidSchema,
} from "../../src/lib/validations";

describe("Zod Validation Schemas", () => {
  describe("loginSchema", () => {
    it("validates correct Ethiopian phone and password", () => {
      const res = loginSchema.safeParse({
        phone: "+251912345678",
        password: "ValidPassword1",
      });
      expect(res.success).toBe(true);
    });

    it("rejects invalid phone formats", () => {
      const res = loginSchema.safeParse({
        phone: "12345",
        password: "ValidPassword1",
      });
      expect(res.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("validates correct registration data with matching passwords", () => {
      const res = registerSchema.safeParse({
        full_name: "Abebe Kebede",
        phone: "0911234567",
        password: "Password123",
        confirmPassword: "Password123",
        acceptTerms: true,
      });
      expect(res.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const res = registerSchema.safeParse({
        full_name: "Abebe Kebede",
        phone: "0911234567",
        password: "Password123",
        confirmPassword: "DifferentPassword456",
        acceptTerms: true,
      });
      expect(res.success).toBe(false);
    });

    it("rejects when terms and conditions are not accepted", () => {
      const res = registerSchema.safeParse({
        full_name: "Abebe Kebede",
        phone: "0911234567",
        password: "Password123",
        confirmPassword: "Password123",
        acceptTerms: false,
      });
      expect(res.success).toBe(false);
    });
  });

  describe("topUpSchema", () => {
    it("accepts valid top-up requests in minor units", () => {
      const res = topUpSchema.safeParse({
        amount: 50000, // 500.00 ETB
        payment_method: "TELEBIRR",
        transaction_id: "TBR982310492",
      });
      expect(res.success).toBe(true);
    });

    it("rejects invalid payment methods", () => {
      const res = topUpSchema.safeParse({
        amount: 50000,
        payment_method: "UNKNOWN_PROVIDER",
        transaction_id: "TBR982310492",
      });
      expect(res.success).toBe(false);
    });
  });
});
