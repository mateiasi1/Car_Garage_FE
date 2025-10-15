export interface CreateCustomerDTO {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface UpdateCustomerDTO {
  customerId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}
