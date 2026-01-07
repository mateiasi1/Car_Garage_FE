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

export interface BranchPackage {
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

export interface CityRef {
  id: string;
  name: string;
  county?: {
    id: string;
    code: string;
    name: string;
  };
}

export interface Branch {
  id: string;
  name: string;
  email: string;
  country: string;
  cityId: string;
  cityRef?: CityRef;
  zipcode?: string;
  street: string;
  streetNumber?: string;
  houseNumber?: string;
  phoneNumber?: string;
  latitude?: number;
  longitude?: number;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  activePackage?: BranchPackage;
}

export interface UpdatePackageRequest {
  packageId: string;
  companyId: string;
  period: 'monthly' | 'yearly';
}

export interface UpdatePackageResponse {
  message: string;
  subscription: BranchPackage;
  price: number;
  months: number;
}
