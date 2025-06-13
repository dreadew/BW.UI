import { defineStore } from "pinia";
import { projectThreadServiceFactory } from "~/services/project/projectThreadServiceFactory";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import type { CreateProjectThreadRequest, UpdateProjectThreadRequest, ProjectThreadDto, ListRequest } from "~/types/request.types";

export const useProjectThreadStore = defineStore("projectThread", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const projectId = ref<string | null>(null);
  const data: Ref<ProjectThreadDto[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const limit = ref(20);
  const offset = ref(0);
  const includeDeleted = ref(false);
  const totalCount = ref(0);

  async function list() {
    loading.value = true;
    try {
      if (!projectId.value) {
        error.value = "Project ID is not set";
        return [];
      }
      const req: ListRequest = {
        limit: limit.value,
        offset: offset.value,
        includeDeleted: includeDeleted.value
      };
      const res = await projectThreadServiceFactory
        .listByProject(projectId.value, req)
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
      return await projectThreadServiceFactory
        .get(id)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(data: CreateProjectThreadRequest) {
    loading.value = true;
    try {
      await projectThreadServiceFactory
        .create(data)
        .ensured("Тред успешно создан");
      return true
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function update(data: UpdateProjectThreadRequest) {
    loading.value = true;
    try {
      await projectThreadServiceFactory
        .update(data)
        .ensured("Тред успешно обновлен");
      return true
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteThread(id: string) {
    loading.value = true;
    try {
      await projectThreadServiceFactory
        .deleteThread(id)
        .ensured("Тред успешно удален");
      return true
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
      await projectThreadServiceFactory
        .restore(id)
        .ensured("Тред успешно восстановлен");
      return true
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
    projectId,
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
    deleteThread,
    restore
  };
});
