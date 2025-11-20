import { createApi } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { CreateInspectorDTO, UpdateInspectorDTO } from '../../interfaces/inspector.payload';
import { User } from '../../models/User';
import { baseQueryWithReAuth } from "../baseQuery";

export const inspectorApi = createApi({
    reducerPath: 'inspectorApi',
    baseQuery: baseQueryWithReAuth,
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
            query: ({ id, ...updatedInspector }) => ({
                url: `${config.inspectorsUrl}/${id}`,
                method: 'PUT',
                body: updatedInspector,
            }),
            invalidatesTags: ['Inspector'],
        }),
        deleteInspector: builder.mutation<void, string>({
            query: (inspectorId) => ({
                url: `${config.inspectorsUrl}/${inspectorId}`,
                method: 'DELETE',
                body: {},
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