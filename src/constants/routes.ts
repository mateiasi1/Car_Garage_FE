export const routes = {
  HOME: '/',
  INSPECTOR_MODE: '/inspector',
  LOGIN: '/login',
  STATIONS: '/stations',
  DASHBOARD: '/dashboard',
  INSPECTIONS: '/inspections',
  ADMINISTRATION: '/administration/:tab?',
  ADMINISTRATION_SHORT: '/administration',
  ADD_INSPECTION: '/add-inspection',
  UNSUBSCRIBE: '/unsubscribe',
  TERMS: '/terms',
  NOT_FOUND: '*',

  // Customer Portal Routes
  CUSTOMER_LOGIN: '/customer/login',
  CUSTOMER_REGISTER: '/customer/register',
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_CARS: '/customer/cars',
  CUSTOMER_CAR_DETAIL: '/customer/cars/:carId',
  CUSTOMER_PROFILE: '/customer/profile',
};
