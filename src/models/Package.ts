export type StatisticsPeriodType = 'today' | 'week' | 'month' | 'year' | 'all' | 'custom';

export interface PackageFeatures {
  sms: {
    limit: number;
    description?: string;
  };
  allowedPeriods?: StatisticsPeriodType[];
  isIndividual?: boolean;
}

export interface Package {
  id: string;
  name: 'Basic' | 'Premium' | 'Enterprise' | 'Individual Basic' | 'Individual Premium' | 'Individual Enterprise';
  description?: string;
  price: number;
  features: PackageFeatures;
  discountPrice?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
