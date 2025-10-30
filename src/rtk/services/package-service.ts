import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../../config';
import { prepareRequestHeaders } from '../../utils/prepareRequestHeaders';
import { Package } from "../../models/Company.ts";

export const packagesApi = createApi({
    reducerPath: 'packagesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.baseUrl,
        prepareHeaders: (headers, { arg }) => prepareRequestHeaders(headers, arg),
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        fetchPackages: builder.query<Package[], void>({
            query: () => ({
                url: '/packages',
                method: 'GET',
            }),
        }),
    }),
});

export const { useFetchPackagesQuery } = packagesApi;