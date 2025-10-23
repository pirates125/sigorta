/**
 * Vade ve yenileme yönetimi için utility fonksiyonları
 */

export type RenewalStatus =
  | "NOT_DUE"
  | "UPCOMING"
  | "DUE_SOON"
  | "URGENT"
  | "EXPIRED"
  | "RENEWED";

/**
 * Poliçenin vade durumunu hesapla
 */
export function calculateRenewalStatus(endDate: Date | null): RenewalStatus {
  if (!endDate) return "NOT_DUE";

  const now = new Date();
  const daysUntilExpiry = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) {
    return "EXPIRED";
  } else if (daysUntilExpiry <= 7) {
    return "URGENT";
  } else if (daysUntilExpiry <= 15) {
    return "DUE_SOON";
  } else if (daysUntilExpiry <= 30) {
    return "UPCOMING";
  } else {
    return "NOT_DUE";
  }
}

/**
 * Vade durumuna göre renk döndür
 */
export function getRenewalStatusColor(status: RenewalStatus): string {
  switch (status) {
    case "NOT_DUE":
      return "text-gray-600";
    case "UPCOMING":
      return "text-blue-600";
    case "DUE_SOON":
      return "text-yellow-600";
    case "URGENT":
      return "text-orange-600";
    case "EXPIRED":
      return "text-red-600";
    case "RENEWED":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
}

/**
 * Vade durumuna göre label döndür
 */
export function getRenewalStatusLabel(status: RenewalStatus): string {
  switch (status) {
    case "NOT_DUE":
      return "Vade Uzak";
    case "UPCOMING":
      return "Yaklaşıyor (30 gün)";
    case "DUE_SOON":
      return "Yakında (15 gün)";
    case "URGENT":
      return "Acil! (7 gün)";
    case "EXPIRED":
      return "Süresi Doldu";
    case "RENEWED":
      return "Yenilendi";
    default:
      return "Bilinmiyor";
  }
}

/**
 * Kalan gün sayısını hesapla
 */
export function getDaysUntilExpiry(endDate: Date | null): number | null {
  if (!endDate) return null;

  const now = new Date();
  const days = Math.ceil(
    (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return days;
}

/**
 * Hatırlatma gönderilmeli mi?
 */
export function shouldSendReminder(
  endDate: Date | null,
  reminderSent: boolean,
  status: RenewalStatus
): boolean {
  if (!endDate || reminderSent) return false;

  // UPCOMING, DUE_SOON veya URGENT durumlarında hatırlatma gönder
  return ["UPCOMING", "DUE_SOON", "URGENT"].includes(status);
}

/**
 * Sigorta türüne göre standart poliçe süresi (gün)
 */
export function getDefaultPolicyDuration(insuranceType: string): number {
  switch (insuranceType) {
    case "TRAFFIC":
    case "KASKO":
      return 365; // 1 yıl
    case "DASK":
      return 365; // 1 yıl
    case "HEALTH":
      return 365; // 1 yıl
    default:
      return 365;
  }
}

/**
 * Poliçe bitiş tarihini hesapla
 */
export function calculatePolicyEndDate(
  startDate: Date,
  insuranceType: string
): Date {
  const duration = getDefaultPolicyDuration(insuranceType);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + duration);
  return endDate;
}
