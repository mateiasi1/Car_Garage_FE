export interface SendInspectionReminderResponse {
  success: boolean;
  message: string;
  data: {
    inspectionId: string;
    customerId: string;
    customerName: string;
    phoneNumber: string;
  };
}
