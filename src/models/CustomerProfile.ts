import { CustomerCar } from './CustomerCar';

export interface LinkedBranch {
  id: string;
  name: string;
  linkedAt: string;
  companyName: string;
}

export type NotificationPreference = 'SMS' | 'APP' | 'BOTH';

export interface CustomerProfile {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  linkedBranches: LinkedBranch[];
  cars: CustomerCar[];
  notificationPreference: NotificationPreference;
}
