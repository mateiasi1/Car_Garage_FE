import { createApi } from '@reduxjs/toolkit/query/react';
import { Package } from "../../models/Company.ts";
import {baseQueryWithReAuth} from "../baseQuery.ts";

export const packagesApi = createApi({
    reducerPath: 'packagesApi',
    baseQuery: baseQueryWithReAuth,
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