export interface Package {
  id: string;
  name: 'Basic' | 'Premium' | 'Enterprise';
  description?: string;
  price: number;
  features: {
    sms: {
      limit: number;
      description: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
