import { DocumentType } from '../models/CustomerCar';
import { NotificationPreference } from '../models/CustomerProfile';

export interface AddCustomerCarDTO {
  licensePlate: string;
  category: string;
  countyId?: string;
  make: string;
  model: string;
}

export interface UpdateCustomerCarDTO {
  licensePlate?: string;
  category?: string;
  countyId?: string;
  make?: string;
  model?: string;
}

export interface AddCarDocumentDTO {
  carId: string;
  type: DocumentType;
  title?: string;
  expiresAt: string;
  replaceExisting?: boolean;
  useExistingInspection?: boolean;
}

export interface UpdateCarDocumentDTO {
  type?: DocumentType;
  title?: string;
  expiresAt?: string;
}

export interface AddCarReminderDTO {
  carId: string;
  title: string;
  description?: string;
  expiresAt: string;
  reminderDaysBefore: number;
  notifyViaSms: boolean;
}

export interface UpdateCarReminderDTO {
  title?: string;
  description?: string;
  expiresAt?: string;
  reminderDaysBefore?: number;
  notifyViaSms?: boolean;
  isActive?: boolean;
}

export interface UpdateCustomerProfileDTO {
  firstName?: string;
  lastName?: string;
  notificationPreference?: NotificationPreference;
}
