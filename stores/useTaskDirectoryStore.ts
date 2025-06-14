import { defineStore } from "pinia";
import { taskDirectoryServiceFactory } from "~/services/project/taskDirectoryServiceFactory";
import type {
  CreateTaskDirectoryRequest,
  UpdateTaskDirectoryRequest,
  TaskDirectoryDto,
  FileDeleteRequest,
  ListRequest,
  BaseDirectoryDto
} from "~/types/request.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useTaskDirectoryStore = defineStore("taskDirectory", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const taskId = ref<string | null>(null);
  const data = ref<BaseDirectoryDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const limit = ref(20);
  const offset = ref(0);

  function resetState() {
    loading.value = false;
    error.value = null;
  }

  async function list(params: ListRequest = { limit: limit.value, offset: offset.value, includeDeleted: false }) {
    resetState();
    loading.value = true;
    try {
      if (!taskId.value) {
        error.value = "Task ID is not set";
        return [];
      }
      const req: ListRequest = {
        limit: params.limit ?? limit.value,
        offset: params.offset ?? offset.value,
        includeDeleted: params.includeDeleted ?? false
      };
      const res = await taskDirectoryServiceFactory
        .list(taskId.value, req)
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      data.value = res;
      return res;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function get(directoryId: string) {
    loading.value = true;
    try {
      return await taskDirectoryServiceFactory
        .get(directoryId)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(request: CreateTaskDirectoryRequest) {
    resetState();
    loading.value = true;

    try {
      await taskDirectoryServiceFactory
        .create(request)
        .ensured("Директория успешно создана");
      await list();
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function update(request: UpdateTaskDirectoryRequest) {
    resetState();
    loading.value = true;

    try {
      await taskDirectoryServiceFactory
        .update(request)
        .ensured("Директория успешно обновлена");
      await list();
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTaskDirectory(directoryId: string) {
    resetState();
    loading.value = true;

    try {
      await taskDirectoryServiceFactory
        .deleteTaskDirectory(directoryId)
        .ensured("Директория успешно удалена");
      await list();
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function restore(directoryId: string) {
    resetState();
    loading.value = true;

    try {
      await taskDirectoryServiceFactory
        .restore(directoryId)
        .ensured("Директория успешно восстановлена");
      await list();
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function uploadArtifact(directoryId: string, file: File) {
    resetState();
    loading.value = true;
    try {
      await taskDirectoryServiceFactory
        .uploadArtifact(directoryId, file)
        .ensured("Файл успешно загружен");
      await list();
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteArtifact(request: FileDeleteRequest) {
    resetState();
    loading.value = true;
    try {
      await taskDirectoryServiceFactory
        .deleteArtifact(request)
        .ensured("Файл успешно удален");
      await list();
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
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
    taskId,
    data,
    loading,
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
    delete: deleteTaskDirectory,
    restore,
    uploadArtifact,
    deleteArtifact,
    resetState,
  };
});
