import { Inspection } from './Inspection';

export interface InspectionsResponse {
  results: Inspection[];
  total: number;
  totalPages: number;
  page: number;
}
