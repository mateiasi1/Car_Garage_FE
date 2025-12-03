import { useMemo, useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import { DemoInfo } from '../models/User';
import { Role } from '../utils/enums/Role';

export interface UseDemoReturn {
  isDemo: boolean;
  demoInfo: DemoInfo | null;
  daysRemaining: number;
  canAddInspection: boolean;
  canAddCustomer: boolean;
  inspectionsUsed: number;
  inspectionsMax: number;
  customersUsed: number;
  customersMax: number;
}

/**
 * Hook to check demo status and limitations
 * Checks both user roles AND demo info from API
 */
export function useDemo(): UseDemoReturn {
  const { user } = useContext(AuthContext);

  return useMemo(() => {
    const demoInfo = user?.demo;
    // Check both: role-based AND demo info from API
    const hasRoleDemo = user?.roles?.some((role) => role.name === Role.demo) ?? false;
    const isDemo = hasRoleDemo || !!demoInfo?.isDemo;

    // If not demo at all, return non-demo defaults
    if (!isDemo) {
      return {
        isDemo: false,
        demoInfo: null,
        daysRemaining: 0,
        canAddInspection: true,
        canAddCustomer: true,
        inspectionsUsed: 0,
        inspectionsMax: 0,
        customersUsed: 0,
        customersMax: 0,
      };
    }

    // Demo user - use demoInfo if available, otherwise use defaults
    const inspectionsUsed = demoInfo?.limits?.inspections?.used ?? 0;
    const inspectionsMax = demoInfo?.maxLimits?.inspections ?? 5;
    const customersUsed = demoInfo?.limits?.customers?.used ?? 0;
    const customersMax = demoInfo?.maxLimits?.customers ?? 5;

    return {
      isDemo: true,
      demoInfo: demoInfo ?? null,
      daysRemaining: demoInfo?.daysRemaining ?? 30,
      canAddInspection: inspectionsUsed < inspectionsMax,
      canAddCustomer: customersUsed < customersMax,
      inspectionsUsed,
      inspectionsMax,
      customersUsed,
      customersMax,
    };
  }, [user]);
}

export default useDemo;
