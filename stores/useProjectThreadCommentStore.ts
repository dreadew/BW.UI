import { defineStore } from "pinia";
import { projectThreadCommentServiceFactory } from "~/services/project/projectThreadCommentServiceFactory";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import type { CreateProjectThreadCommentRequest, UpdateProjectThreadCommentRequest } from "~/types/request.types";
import type { ProjectThreadCommentDto } from "~/types/response.types";
import type { PagingParams } from "~/types/api.types";

export const useProjectThreadCommentStore = defineStore(
  "projectThreadComment",
  () => {
    const toast = useToast();
    const errorHandler = useApiErrorHandler();

    const comments: Ref<ProjectThreadCommentDto[]> = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const limit = ref(20);
    const offset = ref(0);

    async function list(threadId: string, params: PagingParams = {}) {
      isLoading.value = true;
      try {
        const res = await projectThreadCommentServiceFactory
          .listByThread(threadId, { limit: params.limit ?? limit.value, offset: params.offset ?? offset.value, ...params })
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

    async function get(commentId: string) {
      isLoading.value = true;
      try {
        return await projectThreadCommentServiceFactory
          .get(commentId)
          .execute();
      } catch (err) {
        errorHandler.handleError(err);
        return null;
      } finally {
        isLoading.value = false;
      }
    }

    async function create(data: CreateProjectThreadCommentRequest) {
      isLoading.value = true;
      try {
        await projectThreadCommentServiceFactory
          .create(data)
          .ensured("Комментарий успешно создан");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    async function update(data: UpdateProjectThreadCommentRequest) {
      isLoading.value = true;
      try {
        await projectThreadCommentServiceFactory
          .update(data)
          .ensured("Комментарий успешно обновлен");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    async function deleteComment(id: string) {
      isLoading.value = true;
      try {
        await projectThreadCommentServiceFactory
          .delete(id)
          .ensured("Комментарий успешно удален");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    async function restore(id: string) {
      isLoading.value = true;
      try {
        await projectThreadCommentServiceFactory
          .restore(id)
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
      list,
      setPaging,
      nextPage,
      prevPage,
      get,
      create,
      update,
      deleteComment,
      restore
    };
  }
);
