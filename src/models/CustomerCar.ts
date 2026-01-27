import { CarReminder } from './CarReminder';

export type DocumentType = 'ITP' | 'RCA' | 'VIGNETTE' | 'MECHANICAL' | 'CUSTOM';

export interface CarDocument {
  id: string;
  type: DocumentType;
  title?: string;
  expiresAt: string;
  sourceInspectionId?: string;
  isManual: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerCar {
  id: string;
  licensePlate: string;
  category: string;
  countyId?: string;
  make: string;
  model: string;
  documents: CarDocument[];
  reminders: CarReminder[];
  createdAt: string;
  updatedAt: string;
}
