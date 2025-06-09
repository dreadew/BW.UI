import { defineStore } from "pinia";
import { projectThreadServiceFactory } from "~/services/project/projectThreadServiceFactory";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import type { CreateProjectThreadRequest, UpdateProjectThreadRequest, ProjectThreadDto, ListRequest } from "~/types/request.types";

export const useProjectThreadStore = defineStore("projectThread", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const threads: Ref<ProjectThreadDto[]> = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const limit = ref(20);
  const offset = ref(0);

  async function list(projectId: string, params: ListRequest = { limit: limit.value, offset: offset.value, includeDeleted: false }) {
    isLoading.value = true;
    try {
      const req: ListRequest = {
        limit: params.limit ?? limit.value,
        offset: params.offset ?? offset.value,
        includeDeleted: params.includeDeleted ?? false
      };
      const res = await projectThreadServiceFactory
        .listByProject(projectId, req)
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      threads.value = res;
      return threads.value;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function listByProject(projectId: string, params: ListRequest = { limit: limit.value, offset: offset.value, includeDeleted: false }) {
    isLoading.value = true;
    try {
      const req: ListRequest = {
        limit: params.limit ?? limit.value,
        offset: params.offset ?? offset.value,
        includeDeleted: params.includeDeleted ?? false
      };
      const res = await projectThreadServiceFactory
        .listByProject(projectId, req)
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      threads.value = res;
      return threads.value;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
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

  async function get(id: string) {
    isLoading.value = true;
    try {
      return await projectThreadServiceFactory
        .get(id)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(data: CreateProjectThreadRequest) {
    isLoading.value = true;
    try {
      await projectThreadServiceFactory
        .create(data)
        .ensured("Тред успешно создан");
      return true
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(data: UpdateProjectThreadRequest) {
    isLoading.value = true;
    try {
      await projectThreadServiceFactory
        .update(data)
        .ensured("Тред успешно обновлен");
      return true
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteThread(id: string) {
    isLoading.value = true;
    try {
      await projectThreadServiceFactory
        .deleteThread(id)
        .ensured("Тред успешно удален");
      return true
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
      await projectThreadServiceFactory
        .restore(id)
        .ensured("Тред успешно восстановлен");
      return true
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    threads,
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
    deleteThread,
    restore
  };
});
