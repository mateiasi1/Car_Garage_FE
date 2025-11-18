import { Role } from './Role';
import { UserCompany } from './UserCompany';
import { UserBranch } from "./UserBranch.ts";

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
  branches: UserBranch[];
  companies?: UserCompany[];
  selectedBranchId?: string;
}
