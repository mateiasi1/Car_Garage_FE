import { CarCustomer } from './CarCustomer';

export interface InspectionCar {
  id: string;
  licensePlate: string;
  customer: CarCustomer;
}
