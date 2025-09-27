export interface Company {
  id: string;
  name: string;
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
}
