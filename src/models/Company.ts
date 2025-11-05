export enum PackageName {
  Basic = 'Basic',
  Premium = 'Premium',
  Enterprise = 'Enterprise',
}

export interface SMSFeature {
  limit: number;
  description: string;
}

export interface PackageFeatures {
  sms: SMSFeature;
}

export interface Package {
  id: string;
  name: PackageName;
  description?: string;
  price: number;
  features: PackageFeatures;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface SMSUsage {
  used: number;
  limit: number;
  lastReset: string;
}

export interface CompanyPackage {
  id: string;
  companyId: string;
  packageId: string;
  startedAt: string;
  expiringAt: string | null;
  usage: {
    sms: SMSUsage;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  package?: Package; // Populated from backend
}

export interface Company {
  id: string;
  name: string;
  email: string;
  country: string;
  city: string;
  zipcode?: string;
  street: string;
  streetNumber?: string;
  houseNumber?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  activePackage?: CompanyPackage;
}

export interface UpdatePackageRequest {
  packageId: string;
  companyId: string;
  period: 'monthly' | 'yearly';
}

export interface UpdatePackageResponse {
  message: string;
  subscription: CompanyPackage;
  price: number;
  months: number;
}
