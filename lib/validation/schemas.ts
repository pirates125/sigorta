/**
 * Merkezi Zod Validation Schemas
 */

import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  referralCode: z.string().optional(),
});

// Quote Schemas
export const quoteRequestSchema = z.object({
  insuranceType: z.enum(["TRAFFIC", "KASKO", "DASK", "HEALTH"]),
  formData: z.record(z.string(), z.any()),
  email: z.string().email().optional(),
});

// Referral Schemas
export const validateReferralSchema = z.object({
  referralCode: z.string().min(1, "Referans kodu gerekli"),
});

// Profile Schemas
export const updateProfileSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır").optional(),
  email: z.string().email("Geçerli bir email adresi girin").optional(),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır").optional(),
});

// Admin Schemas
export const updateUserRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(["USER", "BROKER", "ADMIN"]),
});

export const blockUserSchema = z.object({
  userId: z.string().cuid(),
  blocked: z.boolean(),
});

// Commission Schemas
export const approveCommissionSchema = z.object({
  commissionId: z.string().cuid(),
  approved: z.boolean(),
  note: z.string().optional(),
});
