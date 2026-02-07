import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://192.168.1.10:5000/api',
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Student', 'Result', 'User'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        // Student endpoints
        getStudents: builder.query({
            query: () => '/students',
            providesTags: ['Student'],
        }),
        createStudent: builder.mutation({
            query: (newStudent) => ({
                url: '/students',
                method: 'POST',
                body: newStudent,
            }),
            invalidatesTags: ['Student'],
        }),
        updateStudent: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/students/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ['Student'],
        }),
        deleteStudent: builder.mutation({
            query: (id) => ({
                url: `/students/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Student'],
        }),
        // Result endpoints
        getResults: builder.query({
            query: () => '/results',
            providesTags: ['Result'],
        }),
        createResult: builder.mutation({
            query: (newResult) => ({
                url: '/results',
                method: 'POST',
                body: newResult,
            }),
            invalidatesTags: ['Result'],
        }),
        updateResult: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/results/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ['Result'],
        }),
        deleteResult: builder.mutation({
            query: (id) => ({
                url: `/results/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Result'],
        }),
        // Bulk endpoints
        bulkImportResults: builder.mutation({
            query: (formData) => ({
                url: '/bulk/import',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Result'],
        }),
        // Public search
        searchResult: builder.query({
            query: (code) => `/public/search/${code}`,
        }),
    }),
});

export const { 
    useLoginMutation,
    useGetStudentsQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
    useGetResultsQuery,
    useCreateResultMutation,
    useUpdateResultMutation,
    useDeleteResultMutation,
    useBulkImportResultsMutation,
    useSearchResultQuery,
} = apiSlice;
