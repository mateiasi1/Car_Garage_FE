import { useMemo, useContext } from 'react';
import { AuthContext } from '../contexts/authContext';
import { DemoInfo } from '../models/User';

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
 * Uses the demo info from the user profile API response stored in AuthContext
 */
export function useDemo(): UseDemoReturn {
  const { user } = useContext(AuthContext);

  return useMemo(() => {
    const demoInfo = user?.demo;
    const isDemo = !!demoInfo?.isDemo;

    if (!isDemo || !demoInfo) {
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

    const inspectionsUsed = demoInfo.limits.inspections.used;
    const inspectionsMax = demoInfo.maxLimits.inspections;
    const customersUsed = demoInfo.limits.customers.used;
    const customersMax = demoInfo.maxLimits.customers;

    return {
      isDemo: true,
      demoInfo,
      daysRemaining: demoInfo.daysRemaining,
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

