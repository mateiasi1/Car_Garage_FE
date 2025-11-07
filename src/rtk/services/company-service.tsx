import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { Company } from '../../models/Company';
import { baseQueryWithReAuth } from '../baseQuery';

export interface CreateCompanyRequest {
  name: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  street: string;
  streetNumber?: string;
  houseNumber?: string;
  zipcode?: string;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  companyId: string;
}

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Companies'],
  endpoints: (builder) => ({
    fetchCompany: builder.query<Company, void>({
      query: () => ({
        url: config.companyUrl,
        method: 'GET',
      }),
      providesTags: ['Companies'],
    }),
  }),
});

export const { useFetchCompanyQuery } = companyApi;
