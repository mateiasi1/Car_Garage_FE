export default {
  baseUrl: `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`,
  loginUrl: '/auth/login',
  usersUrl: '/users',
  userProfileUrl: '/users/profile',
  inspectionsUrl: '/inspection',
  licensePlatePatternsUrl: '/license-plate-patterns',
  changePasswordUrl: '/users/change-password',
  inspectorsUrl: '/inspectors',
  customersUrl: '/customers',
  adminApiUrl: import.meta.env.VITE_ADMIN_API_URL,
  companiesUrl: '/company',
};
