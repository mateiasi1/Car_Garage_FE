import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { Role as RoleEnum } from '../utils/enums/Role';
import { Role as RoleModel } from '../models/Role';

export const useUserRoles = () => {
  const { user } = useAuth();

  const roles = useMemo(() => user?.roles?.map((r: RoleModel) => r.name) ?? [], [user]);

  const hasRole = (role: RoleEnum | string) => {
    const value = String(role);
    return roles.includes(value);
  };

  const hasAnyRole = (required: Array<RoleEnum | string>) => {
    if (!required.length) return true;
    return required.some((r) => roles.includes(String(r)));
  };

  const isAuthorised = (required?: Array<RoleEnum | string>) => {
    if (!required || required.length === 0) return true;
    return hasAnyRole(required);
  };

  return {
    roles,
    hasRole,
    hasAnyRole,
    isAuthorised,
  };
};
