import { InspectedBy } from './InspectedBy';
import { InspectionCar } from './InspectionCar';

export interface Inspection {
  id: string;
  carId: string;
  userId: string;
  type: string;
  inspectedAt: string;
  createdAt: string;
  updatedAt: string;
  car: InspectionCar;
  inspectedBy: InspectedBy;
}
