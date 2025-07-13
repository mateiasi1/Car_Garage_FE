import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { licensePlatePatternsApi } from '../services/licensePlatePattern-service';

export const licensePlatePatternStore = configureStore({
  reducer: {
    [licensePlatePatternsApi.reducerPath]: licensePlatePatternsApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(licensePlatePatternsApi.middleware),
});

setupListeners(licensePlatePatternStore.dispatch);
