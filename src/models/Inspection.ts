import { InspectionType } from '../utils/enums/InspectionTypes';
import { InspectedBy } from './InspectedBy';
import { InspectionCar } from './InspectionCar';

export interface Inspection {
  id: string;
  carId: string;
  userId: string;
  branchId: string;
  type: InspectionType;
  inspectedAt: string;
  createdAt: string;
  updatedAt: string;
  car: InspectionCar;
  inspectedBy: InspectedBy;
  companyId: string;
}
