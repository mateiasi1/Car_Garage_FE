export default {
  baseUrl: `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`,
  loginUrl: '/auth/login',
  usersUrl: '/users',
  userProfileUrl: '/users/profile',
  inspectionsUrl: '/inspection',
  licensePlatePatternsUrl: '/license-plate-patterns',
};
