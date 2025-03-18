import moment from "moment";
import { apiSlice } from "../apiSlice";
import { postTaskActivity } from "../../../../../Server/controllers/taskControllers";

const TASK_URL = "/task";
export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDasboardStats: builder.query({
      query: () => ({
        url: `${TASK_URL}/dashboard`,
        method: "GET",
       
        credentials: "include",
      }),
    }),

    getAllTask: builder.query({
        query: ({ strQuery, isTrashed, search}) =>({
            url: `${TASK_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}`,
            method: "GET",
            credentials: "include",
        })
    }),

    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASK_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASK_URL}/duplicate/${id}`,
        method: "POST",
        body: {},
        credentials: "include",
      }),
    }),

    updateTask: builder.mutation({
      query: (data) => {
        console.log(" Task Data Received in API Slice:", data);
        const taskId = data._id || data.id;
        if (!taskId) {
          console.error(" Error: Task ID is missing in update request!", data);
        }
        return {
          url: `${TASK_URL}/update/${taskId}`,
          method: "PUT",
          body: data,
          credentials: "include",
        };
      },
    }),
    

    trashTask: builder.mutation({
      query: ({id}) => ({
        url: `${TASK_URL}/${id}`,
        method: "PUT",
        body: { isTrashed: true },
        credentials: "include",
      }),
    }),

    deleteTask: builder.mutation({
      query: (id) => ({
        url: `${TASK_URL}/delete/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    createSubTask: builder.mutation({
      query: ({data, id}) => ({
        url: `${TASK_URL}/create-subtask/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getSingleTask : builder.query({
        query: (id) => ({
            url: `${TASK_URL}/${id}`,
            method: "GET",
            credentials: "include",
        })
    }),

    postTaskActivity: builder.mutation({
      query: ({data, id}) => ({
        url: `${TASK_URL}/activity/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    
    deleteRestoreTask: builder.mutation({
      query: ({id, actionType}) => ({
        url: `${TASK_URL}/delete-restore/${id}?actionType=${actionType}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

  }),
});

export const {useGetDasboardStatsQuery,useGetAllTaskQuery, useCreateTaskMutation, useDuplicateTaskMutation, useTrashTaskMutation, useUpdateTaskMutation, useCreateSubTaskMutation, useDeleteTaskMutation, useGetSingleTaskQuery,usePostTaskActivityMutation,useDeleteRestoreTaskMutation} = taskApiSlice
