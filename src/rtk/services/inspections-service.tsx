import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { InspectionsResponse } from '../../models/InspectionsResponse';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';

export interface InspectionsFilters {
  page: number;
  licensePlate?: string;
  inspectionType?: string;
  customerName?: string;
  inspectorName?: string;
}

export const inspectionsApi = createApi({
  reducerPath: 'inspectionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: prepareRequestHeaders,
    credentials: 'include',
  }),
  tagTypes: ['Inspections'],
  endpoints: (builder) => ({
    fetchInspections: builder.query<InspectionsResponse, InspectionsFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters) {
          if (filters.page) params.append('page', filters.page.toString());
          if (filters.licensePlate) params.append('licensePlate', filters.licensePlate);
          if (filters.inspectionType) params.append('inspectionType', filters.inspectionType);
          if (filters.customerName) params.append('customerName', filters.customerName);
          if (filters.inspectorName) params.append('inspectorName', filters.inspectorName);
        }

        return {
          url: `${config.inspectionsUrl}?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Inspections'],
    }),
    createInspection: builder.mutation({
      query: (inspection) => ({
        url: config.inspectionsUrl,
        method: 'POST',
        body: inspection,
      }),
    }),
    updateInspection: builder.mutation({
      query: ({ id, ...inspection }) => ({
        url: `${config.inspectionsUrl}/${id}`,
        method: 'PUT',
        body: inspection,
      }),
    }),
    deleteInspection: builder.mutation<void, string>({
      query: (id) => ({
        url: `${config.inspectionsUrl}/${id}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['Inspections'],
    }),
  }),
});

export const {
  useFetchInspectionsQuery,
  useCreateInspectionMutation,
  useUpdateInspectionMutation,
  useDeleteInspectionMutation,
} = inspectionsApi;
