import { apiSlice } from "../apiSlice";
const USER_URL = "/user";
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    getTeamList: builder.query({
      query: () => ({
        url: `${USER_URL}/get-team`,
        method: "GET",
        credentials: "include",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    userAction: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/${data.id}`,
        method: "PUT",
        body: data,

        credentials: "include",
      }),
    }),

    getNotifications: builder.query({
      query: () => ({
        url: `${USER_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ['Notifications'],
      pollingInterval: 30000,
    }),

    markNotisAsRead: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/read-noti`,
        method: "PUT",
        body: { isReadType: data.type, id: data.id },
        credentials: "include",
      }),
      invalidatesTags: ['Notifications'],
    }),

    chagePassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});
export const {
  useUpdateUserMutation,
  useGetTeamListQuery,
 
  useDeleteUserMutation,
  useUserActionMutation,
 useGetNotificationsQuery,
  useMarkNotisAsReadMutation,
  useChagePasswordMutation,
} = userApiSlice;