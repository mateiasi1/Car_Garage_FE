export interface CarReminder {
  id: string;
  carId: string;
  title: string;
  description?: string;
  expiresAt: string;
  reminderDaysBefore: number;
  notifyViaSms: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
