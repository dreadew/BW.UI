import { defineStore } from "pinia";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import { taskCommentServiceFactory } from "~/services/project/taskCommentServiceFactory";
import type { CreateTaskCommentRequest, UpdateTaskCommentRequest, TaskCommentDto, ListRequest } from "~/types/request.types";

export const useTaskCommentStore = defineStore(
  "taskComment",
  () => {
    const toast = useToast();
    const errorHandler = useApiErrorHandler();

    const taskId = ref<string | null>(null);
    const data = ref<TaskCommentDto[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const limit = ref(20);
    const offset = ref(0);
    const includeDeleted = ref(false);
    const totalCount = ref(0);

    function resetState() {
      loading.value = false;
      error.value = null;
    }

    async function list() {
      loading.value = true;
      try {
        if (!taskId.value) {
          error.value = "Task ID is not set";
          return [];
        }
        const req: ListRequest = {
          limit: limit.value,
          offset: offset.value,
          includeDeleted: includeDeleted.value,
        };
        const res = await taskCommentServiceFactory
          .listByTask(taskId.value, req)
          .execute();
        data.value = res.data;
        totalCount.value = res.totalCount;
        return data.value;
      } catch (err) {
        errorHandler.handleError(err);
        return [];
      } finally {
        loading.value = false;
      }
    }

    async function get(id: string) {
      loading.value = true;

      try {
        return await taskCommentServiceFactory
          .get(id)
          .execute();
      } catch (err) {
        errorHandler.handleError(err);
        return [];
      } finally {
        loading.value = false;
      }
    }

    async function create(request: CreateTaskCommentRequest) {
      resetState();
      loading.value = true;

      try {
        await taskCommentServiceFactory
          .create(request)
          .ensured("Комментарий успешно добавлено");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        loading.value = false;
      }
    }

    async function update(request: UpdateTaskCommentRequest) {
      resetState();
      loading.value = true;

      try {
        await taskCommentServiceFactory
          .update(request)
          .ensured("Комментарий успешно обновлен");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        loading.value = false;
      }
    }

    async function deleteComment(commentId: string) {
      resetState();
      loading.value = true;

      try {
        await taskCommentServiceFactory
          .delete(commentId)
          .ensured("Комментарий успешно удален");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        loading.value = false;
      }
    }

    async function restore(commentId: string) {
      resetState();
      loading.value = true;

      try {
        await taskCommentServiceFactory
          .restore(commentId)
          .ensured("Комментарий успешно восстановлен");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        loading.value = false;
      }
    }

    async function reset() {
      offset.value = 0;
      limit.value = 20;
      totalCount.value = 0;
      data.value = [];
    }

    const prevPage = () => {
      const newOffset = offset.value - limit.value;
      if (newOffset < 0) {
        offset.value = 0;
        return;
      }
      offset.value = newOffset;
    }

    const nextPage = () => {
      const newOffset = offset.value + limit.value;
      if (newOffset >= totalCount.value) {
        return;
      }
      offset.value = newOffset;
    }

    const currentPage = computed(() => offset.value / limit.value + 1);

    watch(() => [offset.value, includeDeleted.value], () => {
      list()
    })

    return {
      taskId,
      data,
      loading,
      currentPage,
      error,
      limit,
      offset,
      includeDeleted,
      totalCount,
      list,
      reset,
      nextPage,
      prevPage,
      get,
      create,
      update,
      deleteComment,
      restore,
      resetState,
    };
  }
);
