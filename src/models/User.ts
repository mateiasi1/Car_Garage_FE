import { Role } from './Role';
import { UserCompany } from './UserCompany';

export interface DemoLimits {
  inspections: { used: number; max: number };
  customers: { used: number; max: number };
}

export interface DemoInfo {
  isDemo: boolean;
  expiresAt: string;
  daysRemaining: number;
  limits: DemoLimits;
  maxLimits: {
    inspections: number;
    customers: number;
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  canSendSms?: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  roles: Role[];
  activeBranch?: { id: string; name: string };
  companies?: UserCompany[];
  selectedBranchId?: string;
  demo?: DemoInfo;
}
