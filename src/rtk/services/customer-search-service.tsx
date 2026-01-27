import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from '../baseQuery';

export interface CustomerSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isPortalUser: boolean;
  cars: {
    id: string;
    licensePlate: string;
    make: string;
    model: string;
    category: string;
  }[];
}

export const customerSearchApi = createApi({
  reducerPath: 'customerSearchApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    searchCustomers: builder.query<CustomerSearchResult[], string>({
      query: (searchQuery) => ({
        url: '/customers/search',
        params: { query: searchQuery },
      }),
    }),
  }),
});

export const { useSearchCustomersQuery, useLazySearchCustomersQuery } = customerSearchApi;
