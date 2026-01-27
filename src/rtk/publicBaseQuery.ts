import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import config from '../config';

/**
 * Base query for public endpoints that don't require authentication.
 * Does not send auth tokens and does not redirect on errors.
 */
export const publicBaseQuery = fetchBaseQuery({
  baseUrl: config.baseUrl,
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    headers.set('Accept-Language', 'ro');

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  },
});
