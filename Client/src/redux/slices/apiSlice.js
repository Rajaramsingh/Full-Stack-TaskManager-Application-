import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// For production, use the Render URL
const API_URI = import.meta.env.VITE_APP_BASE_URL || 'https://your-render-backend-url.onrender.com';

const baseQuery = fetchBaseQuery({
    baseUrl: `${API_URI}/api`,
    credentials: "include",
    prepareHeaders: (headers) => {
        headers.set('Content-Type', 'application/json');
        return headers;
    }
});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: [],
    endpoints: (builder) => ({}),
})
