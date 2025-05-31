import { defineStore } from "pinia";
import { projectThreadServiceFactory } from "~/services/project/projectThreadServiceFactory";
import { useToast } from "vue-toastification";
import { useApiErrorHandler } from "~/utils/apiErrorHandler";
import type { CreateProjectThreadRequest, UpdateProjectThreadRequest } from "~/types/request.types";
import type { ProjectThreadDto } from "~/types/response.types";

export const useProjectThreadStore = defineStore("projectThread", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const threads: Ref<ProjectThreadDto[]> = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function list(projectId: string) {
    isLoading.value = true;
    try {
      const res = await projectThreadServiceFactory
        .listByProject(projectId)
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
    list,
    get,
    create, 
    update,
    deleteThread,
    restore 
  };
});
