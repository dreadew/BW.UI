import { defineStore } from "pinia";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import { taskCommentServiceFactory } from "~/services/project/taskCommentServiceFactory";
import type { CreateTaskCommentRequest, UpdateTaskCommentRequest, TaskCommentDto, ListRequest } from "~/types/request.types";

export const useTaskCommentStore = defineStore(
  "taskComment",
  () => {
    const toast = useToast();
    const errorHandler = useApiErrorHandler();

    const comments = ref<TaskCommentDto[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const limit = ref(20);
    const offset = ref(0);

    function resetState() {
      isLoading.value = false;
      error.value = null;
    }

    async function listByTask(taskId: string, params: ListRequest = { limit: limit.value, offset: offset.value, includeDeleted: false }) {
      isLoading.value = true;
      try {
        const req: ListRequest = {
          limit: params.limit ?? limit.value,
          offset: params.offset ?? offset.value,
          includeDeleted: params.includeDeleted ?? false
        };
        const res = await taskCommentServiceFactory
          .listByTask(taskId, req)
          .execute();
        if (!res || res.length === 0) {
          return [];
        }
        comments.value = res;
        return comments.value;
      } catch (err) {
        errorHandler.handleError(err);
        return [];
      } finally {
        isLoading.value = false;
      }
    }

    async function get(id: string) {
      isLoading.value = true;

      try {
        return await taskCommentServiceFactory
          .get(id)
          .execute();
      } catch (err) {
        errorHandler.handleError(err);
        return [];
      } finally {
        isLoading.value = false;
      }
    }

    async function create(request: CreateTaskCommentRequest) {
      resetState();
      isLoading.value = true;

      try {
        await taskCommentServiceFactory
          .create(request)
          .ensured("Комментарий успешно добавлено");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    async function update(request: UpdateTaskCommentRequest) {
      resetState();
      isLoading.value = true;

      try {
        await taskCommentServiceFactory
          .update(request)
          .ensured("Комментарий успешно обновлен");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    async function deleteComment(commentId: string) {
      resetState();
      isLoading.value = true;

      try {
        await taskCommentServiceFactory
          .delete(commentId)
          .ensured("Комментарий успешно удален");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    async function restore(commentId: string) {
      resetState();
      isLoading.value = true;

      try {
        await taskCommentServiceFactory
          .restore(commentId)
          .ensured("Комментарий успешно восстановлен");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    function setPaging(newLimit: number, newOffset: number) {
      limit.value = newLimit;
      offset.value = newOffset;
    }

    function nextPage() {
      offset.value += limit.value;
    }

    function prevPage() {
      offset.value = Math.max(0, offset.value - limit.value);
    }

    return {
      comments,
      isLoading,
      error,
      limit,
      offset,
      listByTask,
      setPaging,
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
