import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './rtk/services/auth-service';
import { inspectionsApi } from './rtk/services/inspections-service';
import { userApi } from './rtk/services/user-service';
import { licensePlatePatternsApi } from './rtk/services/licensePlatePattern-service';
import inspectionReducer from './slices/inspectionSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [inspectionsApi.reducerPath]: inspectionsApi.reducer,
    [licensePlatePatternsApi.reducerPath]: licensePlatePatternsApi.reducer,
    inspection: inspectionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      inspectionsApi.middleware,
      licensePlatePatternsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
