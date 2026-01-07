export interface CityRef {
  id: string;
  name: string;
  county?: {
    id: string;
    code: string;
    name: string;
  };
}

export interface Company {
  id: string;
  name: string;
  shortName: string;
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
  isIndividual: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
