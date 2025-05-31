import { defineStore } from "pinia";
import { taskActivityServiceFactory } from "~/services/project/taskActivityServiceFactory";
import type {
  CreateTaskActivityRequest,
  TaskActivityDto,
  UpdateTaskActivityRequest,
} from "~/types/project/taskActivity.types";
import { useApiErrorHandler } from "~/utils/apiErrorHandler";
import { useToast } from "vue-toastification";

export const useTaskActivityStore = defineStore("taskActivity", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const activities = ref<TaskActivityDto[]>([]);
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
      const res = await taskActivityServiceFactory
        .listByTask(taskId)
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      activities.value = res;
      return activities.value;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function listByUser(userId: string) {
    resetState();
    isLoading.value = true;

    try {
      const res = await taskActivityServiceFactory
        .listByUser(userId)
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      activities.value = res;
      return activities.value;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function get(taskActivityId: string) {
    isLoading.value = true;

    try {
      return await taskActivityServiceFactory
        .get(taskActivityId)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(request: CreateTaskActivityRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskActivityServiceFactory
        .create(request)
        .ensured("Активность успешно добавлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(request: UpdateTaskActivityRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskActivityServiceFactory
        .update(request)
        .ensured("Активность успешно обновлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTaskActivity(activityId: string) {
    resetState();
    isLoading.value = true;

    try {
      await taskActivityServiceFactory
        .delete(activityId)
        .ensured("Активность успешно удалена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    activities,
    isLoading,
    error,
    listByTask,
    listByUser,
    get,
    create,
    update,
    deleteTaskActivity,
    resetState,
  };
});
