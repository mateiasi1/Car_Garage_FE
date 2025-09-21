import { Role } from './Role';
import { UserCompany } from './UserCompany';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  roles: Role[];
  companies: UserCompany[];
}
