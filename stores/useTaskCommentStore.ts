import { defineStore } from "pinia";
import { useApiErrorHandler } from "~/utils/apiErrorHandler";
import { useToast } from "vue-toastification";
import type { CreateTaskCommentRequest, TaskCommentDto, UpdateTaskCommentRequest } from "~/types/project/taskComment.types";
import { taskCommentServiceFactory } from "~/services/project/taskCommentServiceFactory";

export const useProjectRoleClaimsStore = defineStore(
  "taskComment",
  () => {
    const toast = useToast();
    const errorHandler = useApiErrorHandler();

    const comments = ref<TaskCommentDto[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    function resetState() {
      isLoading.value = false;
      error.value = null;
    }

    async function listByTask(taskId: string) {
      resetState();
      isLoading.value = true;

      try {
        const res = await taskCommentServiceFactory
          .listByTask(taskId)
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

    return {
      comments,
      isLoading,
      error,
      listByTask,
      get,
      create,
      update,
      deleteComment,
      restore,
      resetState,
    };
  }
);
