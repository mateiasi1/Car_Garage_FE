import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { createBaseQueryWithReAuth } from '../baseQuery';

export interface CreateDiscountDTO {
  companyId?: string | null;
  branchIds?: string[] | null;
  packageIds?: string[] | null;
  discountPercentage: number;
  expiresAt?: string | null;
}

export interface DiscountResponse {
  id: string;
  companyId?: string | null;
  branchId?: string | null;
  packageId?: string | null;
  discountPercentage: number;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
  };
  branch?: {
    id: string;
    name: string;
  };
  package?: {
    id: string;
    name: string;
  };
}

// Map of packageId to discount info
export interface DiscountInfo {
  percentage: number;
  expiresAt: string | null;
}

export type BranchDiscountsResponse = Record<string, DiscountInfo>;

export interface FetchBranchDiscountsParams {
  branchId?: string;
  packageIds: string[];
}

export const discountApi = createApi({
  reducerPath: 'discountApi',
  baseQuery: createBaseQueryWithReAuth(`${config.baseUrl}/discounts`),
  tagTypes: ['Discount'],
  endpoints: (builder) => ({
    fetchAllDiscounts: builder.query<DiscountResponse[], void>({
      query: () => '/',
      providesTags: ['Discount'],
    }),
    fetchDiscountsByCompany: builder.query<DiscountResponse[], string>({
      query: (companyId) => `/company/${companyId}`,
      providesTags: ['Discount'],
    }),
    fetchBranchDiscounts: builder.query<BranchDiscountsResponse, FetchBranchDiscountsParams>({
      query: ({ branchId, packageIds }) => ({
        url: '/branch',
        method: 'POST',
        body: { branchId, packageIds },
      }),
      providesTags: ['Discount'],
    }),
    createDiscount: builder.mutation<DiscountResponse[], CreateDiscountDTO>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Discount'],
    }),
    deleteDiscount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Discount'],
    }),
  }),
});

export const {
  useFetchAllDiscountsQuery,
  useFetchDiscountsByCompanyQuery,
  useFetchBranchDiscountsQuery,
  useCreateDiscountMutation,
  useDeleteDiscountMutation,
} = discountApi;
