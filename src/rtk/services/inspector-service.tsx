import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { CreateInspectorDTO, UpdateInspectorDTO } from '../../interfaces/inspector.payload';
import { User } from '../../models/User';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';

export const inspectorApi = createApi({
  reducerPath: 'inspectorApi',
  baseQuery: fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: (headers, { arg }) => prepareRequestHeaders(headers, arg),
    credentials: 'include',
  }),
  tagTypes: ['Inspector'],
  endpoints: (builder) => ({
    fetchInspectors: builder.query<User[], void>({
      query: () => config.inspectorsUrl,
      providesTags: ['Inspector'],
    }),
    createInspector: builder.mutation<void, CreateInspectorDTO>({
      query: (newInspector) => ({
        url: config.inspectorsUrl,
        method: 'POST',
        body: newInspector,
      }),
      invalidatesTags: ['Inspector'],
    }),
    updateInspector: builder.mutation<void, UpdateInspectorDTO>({
      query: (updatedInspector) => ({
        url: `${config.inspectorsUrl}`,
        method: 'PUT',
        body: updatedInspector,
      }),
      invalidatesTags: ['Inspector'],
    }),
    deleteInspector: builder.mutation<void, string>({
      query: (userId) => ({
        url: `${config.usersUrl}/${userId}`,
        method: 'DELETE',
        body: undefined,
      }),
      invalidatesTags: ['Inspector'],
    }),
  }),
});

export const {
  useFetchInspectorsQuery,
  useCreateInspectorMutation,
  useUpdateInspectorMutation,
  useDeleteInspectorMutation,
} = inspectorApi;
