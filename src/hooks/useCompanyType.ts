import { useAuth } from './useAuth';

/**
 * Hook to check if the current user's company is an individual company
 * @returns {boolean} true if company is individual, false otherwise
 */
export const useCompanyType = () => {
  const { user } = useAuth();

  // Get isIndividual from the first company in user profile
  const isIndividual = user?.companies?.[0]?.isIndividual ?? false;

  return {
    isIndividual,
    hasCompany: !!user?.companies?.[0],
  };
};

