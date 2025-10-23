export type KaskoCoverageType = "MINI" | "MIDI" | "MAXI";
export type UsageType = "PRIVATE" | "TAXI" | "COMMERCIAL";

export interface Coverage {
  id: string;
  name: string;
  description: string;
  includedIn: KaskoCoverageType[];
}

export const kaskoCoverages: Coverage[] = [
  {
    id: "collision",
    name: "Çarpma - Çarpılma",
    description: "Kaza sonucu oluşan hasarlar",
    includedIn: ["MINI", "MIDI", "MAXI"],
  },
  {
    id: "fire",
    name: "Yangın",
    description: "Yangın ve infilak hasarları",
    includedIn: ["MINI", "MIDI", "MAXI"],
  },
  {
    id: "theft",
    name: "Hırsızlık",
    description: "Aracın çalınması durumu",
    includedIn: ["MINI", "MIDI", "MAXI"],
  },
  {
    id: "glass",
    name: "Cam Hasarları",
    description: "Ön, yan ve arka cam kırılmaları",
    includedIn: ["MIDI", "MAXI"],
  },
  {
    id: "flood",
    name: "Sel - Su Baskını",
    description: "Doğal afet kaynaklı su hasarları",
    includedIn: ["MIDI", "MAXI"],
  },
  {
    id: "earthquake",
    name: "Deprem",
    description: "Deprem sonucu oluşan hasarlar",
    includedIn: ["MAXI"],
  },
  {
    id: "mini_repair",
    name: "Mini Onarım",
    description: "Küçük çizik ve boyalar",
    includedIn: ["MAXI"],
  },
  {
    id: "keyless_theft",
    name: "Anahtarsız Çalınma",
    description: "Anahtarsız çalınan araç hasarı",
    includedIn: ["MAXI"],
  },
  {
    id: "windshield",
    name: "Ön Cam Filmi",
    description: "Ön cam film değişimi",
    includedIn: ["MAXI"],
  },
];

export interface KaskoCoveragePackage {
  type: KaskoCoverageType;
  name: string;
  description: string;
  emoji: string;
  popular?: boolean;
  coverages: string[]; // Coverage IDs
}

export const kaskoCoveragePackages: KaskoCoveragePackage[] = [
  {
    type: "MINI",
    name: "Mini Kasko",
    description: "Temel koruma paketi",
    emoji: "🛡️",
    coverages: ["collision", "fire", "theft"],
  },
  {
    type: "MIDI",
    name: "Midi Kasko",
    description: "Orta düzey koruma paketi",
    emoji: "🔰",
    popular: true,
    coverages: ["collision", "fire", "theft", "glass", "flood"],
  },
  {
    type: "MAXI",
    name: "Maxi Kasko",
    description: "Tam koruma paketi",
    emoji: "⭐",
    coverages: [
      "collision",
      "fire",
      "theft",
      "glass",
      "flood",
      "earthquake",
      "mini_repair",
      "keyless_theft",
      "windshield",
    ],
  },
];

export const usageTypes = [
  { value: "PRIVATE", label: "Özel Kullanım" },
  { value: "TAXI", label: "Taksi" },
  { value: "COMMERCIAL", label: "Ticari" },
];

// Araç yaşına göre değer düşüş oranları (%)
export const vehicleDepreciationRates: Record<number, number> = {
  0: 0, // 0 km
  1: 10,
  2: 18,
  3: 25,
  4: 31,
  5: 36,
  6: 40,
  7: 44,
  8: 47,
  9: 50,
  10: 52,
};

// Kullanım şekline göre fiyat katsayıları
export const usageMultipliers: Record<UsageType, number> = {
  PRIVATE: 1.0,
  TAXI: 1.5,
  COMMERCIAL: 1.3,
};

// Teminat paketine göre fiyat katsayıları (araç değerine göre %)
export const coverageMultipliers: Record<KaskoCoverageType, number> = {
  MINI: 0.03, // Araç değerinin %3'ü
  MIDI: 0.045, // Araç değerinin %4.5'u
  MAXI: 0.06, // Araç değerinin %6'sı
};

