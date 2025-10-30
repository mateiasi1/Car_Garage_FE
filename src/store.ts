import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './rtk/services/auth-service';
import { inspectionsApi } from './rtk/services/inspections-service';
import { userApi } from './rtk/services/user-service';
import { licensePlatePatternsApi } from './rtk/services/licensePlatePattern-service';
import { inspectorApi } from './rtk/services/inspector-service';
import inspectionReducer from './slices/inspectionSlice';
import { customerApi } from './rtk/services/customer-service';
import { adminApi } from './rtk/services/admin-service';
import { companyApi } from './rtk/services/company-service';
import { packagesApi } from './rtk/services/package-service';

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [inspectionsApi.reducerPath]: inspectionsApi.reducer,
        [customerApi.reducerPath]: customerApi.reducer,
        [licensePlatePatternsApi.reducerPath]: licensePlatePatternsApi.reducer,
        [inspectorApi.reducerPath]: inspectorApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [companyApi.reducerPath]: companyApi.reducer,
        [packagesApi.reducerPath]: packagesApi.reducer,
        inspection: inspectionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            userApi.middleware,
            inspectionsApi.middleware,
            customerApi.middleware,
            licensePlatePatternsApi.middleware,
            inspectorApi.middleware,
            adminApi.middleware,
            companyApi.middleware,
            packagesApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;