import { defineStore } from "pinia";
import { projectThreadCommentServiceFactory } from "~/services/project/projectThreadCommentServiceFactory";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import type { ListRequest, CreateProjectThreadCommentRequest, UpdateProjectThreadCommentRequest, ProjectThreadCommentDto } from "~/types/request.types";

export const useProjectThreadCommentStore = defineStore(
  "projectThreadComment",
  () => {
    const toast = useToast();
    const errorHandler = useApiErrorHandler();

    const threadId = ref<string | null>(null);
    const data: Ref<ProjectThreadCommentDto[]> = ref([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const limit = ref(20);
    const offset = ref(0);
    const includeDeleted = ref(false);
    const totalCount = ref(0);

    async function list() {
      loading.value = true;
      try {
        if (!threadId.value) {
          error.value = "Thread ID is not set";
          return [];
        }
        const req: ListRequest = {
          limit: limit.value,
          offset: offset.value,
          includeDeleted: includeDeleted.value
        };
        const res = await projectThreadCommentServiceFactory.listByThread(threadId.value, req).execute();
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

    async function get(commentId: string) {
      loading.value = true;
      try {
        return await projectThreadCommentServiceFactory
          .get(commentId)
          .execute();
      } catch (err) {
        errorHandler.handleError(err);
        return null;
      } finally {
        loading.value = false;
      }
    }

    async function create(data: CreateProjectThreadCommentRequest) {
      loading.value = true;
      try {
        await projectThreadCommentServiceFactory
          .create(data)
          .ensured("Комментарий успешно создан");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        loading.value = false;
      }
    }

    async function update(data: UpdateProjectThreadCommentRequest) {
      loading.value = true;
      try {
        await projectThreadCommentServiceFactory
          .update(data)
          .ensured("Комментарий успешно обновлен");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        loading.value = false;
      }
    }

    async function deleteComment(id: string) {
      loading.value = true;
      try {
        await projectThreadCommentServiceFactory
          .delete(id)
          .ensured("Комментарий успешно удален");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        loading.value = false;
      }
    }

    async function restore(id: string) {
      loading.value = true;
      try {
        await projectThreadCommentServiceFactory
          .restore(id)
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
      threadId,
      currentPage,
      data,
      loading,
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
      restore
    };
  }
);
