import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { InspectionsResponse } from '../../models/InspectionsResponse';
import { baseQueryWithReAuth } from '../baseQuery';

export interface InspectionsFilters {
  page: number;
  licensePlate: string;
  inspectionType: string;
  customerName: string;
  inspectorName: string;
}

export const inspectionsApi = createApi({
  reducerPath: 'inspectionsApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Inspections'],
  endpoints: (builder) => ({
    fetchInspections: builder.query<InspectionsResponse, InspectionsFilters | void>({
      query: (filters: InspectionsFilters) => {
        const params = new URLSearchParams();
        params.append('page', filters.page.toString());
        params.append('licensePlate', filters.licensePlate);
        params.append('inspectionType', filters.inspectionType);
        params.append('customerName', filters.customerName);
        params.append('inspectorName', filters.inspectorName);

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
      invalidatesTags: ['Inspections'],
    }),
    updateInspection: builder.mutation({
      query: ({ id, ...inspection }) => ({
        url: `${config.inspectionsUrl}/${id}`,
        method: 'PUT',
        body: inspection,
      }),
      invalidatesTags: ['Inspections'],
    }),
    deleteInspection: builder.mutation<void, string>({
      query: (id) => ({
        url: `${config.inspectionsUrl}/${id}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: ['Inspections', 'User'],
    }),
  }),
});

export const {
  useFetchInspectionsQuery,
  useCreateInspectionMutation,
  useUpdateInspectionMutation,
  useDeleteInspectionMutation,
} = inspectionsApi;
