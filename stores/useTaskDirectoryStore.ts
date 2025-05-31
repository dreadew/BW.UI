import { defineStore } from "pinia";
import { taskDirectoryServiceFactory } from "~/services/project/taskDirectoryServiceFactory";
import type {
  CreateTaskDirectoryRequest,
  TaskDirectoryArtifactDto,
  TaskDirectoryDto,
  UpdateTaskDirectoryRequest,
} from "~/types/project/taskDirectory.types";
import { useApiErrorHandler } from "~/utils/apiErrorHandler";
import { useToast } from "vue-toastification";
import type { DeleteFileRequest } from "~/types/file.types";

export const useTaskDirectoryStore = defineStore("taskDirectory", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const directories = ref<TaskDirectoryDto[]>([]);
  const artifacts = ref<Record<string, TaskDirectoryArtifactDto[]>>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  function resetState() {
    isLoading.value = false;
    error.value = null;
  }

  async function list(taskId: string) {
    resetState();
    isLoading.value = true;

    try {
      const res = await taskDirectoryServiceFactory
        .list(taskId)
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      directories.value = res;
      return res;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function get(directoryId: string) {
    isLoading.value = true;
    try {
      return await taskDirectoryServiceFactory
        .get(directoryId)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(request: CreateTaskDirectoryRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskDirectoryServiceFactory
        .create(request)
        .ensured("Директория успешно создана");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(request: UpdateTaskDirectoryRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskDirectoryServiceFactory
        .update(request)
        .ensured("Директория успешно обновлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTaskDirectory(directoryId: string) {
    resetState();
    isLoading.value = true;

    try {
      await taskDirectoryServiceFactory
        .deleteTaskDirectory(directoryId)
        .ensured("Директория успешно удалена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function restore(directoryId: string) {
    resetState();
    isLoading.value = true;

    try {
      await taskDirectoryServiceFactory
        .restore(directoryId)
        .ensured("Директория успешно восстановлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function uploadArtifact(directoryId: string, file: File) {
    resetState();
    isLoading.value = true;

    try {
      await taskDirectoryServiceFactory
        .uploadArtifact(directoryId, file)
        .ensured("Файл успешно загружен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteArtifact(request: DeleteFileRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskDirectoryServiceFactory
        .deleteArtifact(request)
        .ensured("Файл успешно удален");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    directories,
    artifacts,
    isLoading,
    error,
    list,
    get,
    create,
    update,
    deleteTaskDirectory,
    restore,
    uploadArtifact,
    deleteArtifact,
    resetState,
  };
});
