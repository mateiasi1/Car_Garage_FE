// API URL priority: VITE_API_URL (production) > HOST:PORT (local dev) > fallback
const getBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.VITE_API_HOST && import.meta.env.VITE_API_PORT) {
    return `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`;
  }
  return 'http://localhost:3000';
};

export default {
  baseUrl: getBaseUrl(),
  loginUrl: '/auth/login',
  usersUrl: '/users',
  userProfileUrl: '/users/profile',
  inspectionsUrl: '/inspection',
  licensePlatePatternsUrl: '/license-plate-patterns',
  changePasswordUrl: '/users/change-password',
  inspectorsUrl: '/inspectors',
  customersUrl: '/customers',
  adminApiUrl: import.meta.env.VITE_ADMIN_API_URL,
  companyUrl: '/company',
  companiesUrl: '/companies',
  branchUrl: '/branch',
  statisticsUrl: '/statistics',
};
