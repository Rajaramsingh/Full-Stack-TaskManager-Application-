import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URI = import.meta.env.VITE_APP_BASE_URL;

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
    tagTypes: ['User', 'Task', 'Notification'],
    endpoints: (builder) => ({})
});