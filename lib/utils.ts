import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function generateAccessToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export function validateTCKN(tckn: string): boolean {
  if (!/^\d{11}$/.test(tckn)) return false;

  const digits = tckn.split("").map(Number);
  if (digits[0] === 0) return false;

  const sum1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7;
  const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
  const check10 = (sum1 - sum2) % 10;

  if (check10 !== digits[9]) return false;

  const sum11 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  if (sum11 % 10 !== digits[10]) return false;

  return true;
}

export function validatePlate(plate: string): boolean {
  // Türk plaka formatı: 34 ABC 123 veya 34 ABC 12
  const plateRegex = /^(0[1-9]|[1-7][0-9]|8[01])\s?[A-Z]{1,3}\s?\d{2,4}$/i;
  return plateRegex.test(plate.toUpperCase());
}

export function normalizePlate(plate: string): string {
  return plate.toUpperCase().replace(/\s/g, "");
}
