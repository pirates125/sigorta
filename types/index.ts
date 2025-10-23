import { InsuranceType } from "@prisma/client";

// Trafik Sigortası Form
export interface TrafficInsuranceFormData {
  plate: string;
  registrationCode: string; // Tescil Seri Kod (ABC - 3 karakter)
  registrationNumber: string; // Tescil/ASBIS No (19 karakter)
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  engineNumber: string;
  chassisNumber: string;
  driverName: string;
  driverTCKN: string;
  driverBirthDate: string;
  driverLicenseDate: string;
  previousInsurance?: string;
  hasClaimHistory: boolean;
  claimCount?: number;
  email?: string;
  phone?: string; // Telefon (5XXXXXXXXX - 10 karakter)
}

// Kasko Form
export interface KaskoInsuranceFormData extends TrafficInsuranceFormData {
  vehicleValue: number;
  deductible: number;
  coverage: {
    theft: boolean;
    fire: boolean;
    naturalDisaster: boolean;
    terrorismAndCivilCommotion: boolean;
    driverAccident: boolean;
    glassBreakage: boolean;
    roadAssistance: boolean;
  };
}

// DASK Form
export interface DaskInsuranceFormData {
  ownerName: string;
  ownerTCKN: string;
  address: string;
  city: string;
  district: string;
  neighborhood: string;
  buildingType: "betonarme" | "ahsap" | "karkas" | "yigma";
  constructionYear: number;
  floor: number;
  totalFloors: number;
  squareMeters: number;
  usage: "konut" | "isyeri" | "ofis";
}

// Sağlık Sigortası Form
export interface HealthInsuranceFormData {
  insuredName: string;
  insuredTCKN: string;
  insuredBirthDate: string;
  gender: "male" | "female";
  maritalStatus: "single" | "married";
  occupation: string;
  height: number;
  weight: number;
  smoker: boolean;
  chronicDiseases: string[];
  previousSurgeries: string[];
  currentMedications: string[];
  coverage: {
    inpatient: boolean;
    outpatient: boolean;
    dental: boolean;
    glasses: boolean;
    maternity: boolean;
    checkup: boolean;
  };
  dependents?: Array<{
    name: string;
    tckn: string;
    birthDate: string;
    relation: string;
  }>;
}

// Quote Request
export interface QuoteRequest {
  insuranceType: InsuranceType;
  formData:
    | TrafficInsuranceFormData
    | KaskoInsuranceFormData
    | DaskInsuranceFormData
    | HealthInsuranceFormData;
  email?: string;
  userId?: string;
}

// Scraper Result
export interface ScraperResult {
  companyCode: string;
  companyName: string;
  price: number;
  currency: string;
  coverageDetails?: any;
  responseData?: any;
  success: boolean;
  error?: string;
  duration: number;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalQuotes: number;
  totalPolicies: number;
  totalRevenue: number;
  todayQuotes: number;
  todayPolicies: number;
  activeScrapers: number;
  scraperSuccessRate: number;
}
