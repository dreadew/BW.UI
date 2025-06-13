import { defineStore } from "pinia";
import { taskActivityServiceFactory } from "~/services/project/taskActivityServiceFactory";
import type {
  CreateTaskActivityRequest,
  UpdateTaskActivityRequest,
  TaskActivityDto,
  ListRequest,
} from "~/types/request.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useTaskActivityStore = defineStore("taskActivity", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const userId = ref<string | null>(null);
  const taskId = ref<string | null>(null);
  const data = ref<TaskActivityDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const limit = ref(20);
  const offset = ref(0);
  const includeDeleted = ref(false);
  const totalCount = ref(0);

  function resetState() {
    loading.value = false;
    error.value = null;
  }

  async function list() {
    loading.value = true;
    try {
      if (!taskId.value) {
        error.value = "Task ID is not set";
        return [];
      }
      const res = await taskActivityServiceFactory
        .listByTask(taskId.value, {
          limit: limit.value,
          offset: offset.value,
          includeDeleted: includeDeleted.value,
        })
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

  async function listByUser(userId: string) {
    loading.value = true;
    try {
      const res = await taskActivityServiceFactory
        .listByUser(userId, {
          limit: limit.value,
          offset: offset.value,
          includeDeleted: includeDeleted.value,
        })
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

  async function get(taskActivityId: string) {
    loading.value = true;

    try {
      return await taskActivityServiceFactory
        .get(taskActivityId)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(request: CreateTaskActivityRequest) {
    resetState();
    loading.value = true;

    try {
      await taskActivityServiceFactory
        .create(request)
        .ensured("Активность успешно добавлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function update(request: UpdateTaskActivityRequest) {
    resetState();
    loading.value = true;

    try {
      await taskActivityServiceFactory
        .update(request)
        .ensured("Активность успешно обновлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTaskActivity(activityId: string) {
    resetState();
    loading.value = true;

    try {
      await taskActivityServiceFactory
        .delete(activityId)
        .ensured("Активность успешно удалена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  const currentPage = computed(() => offset.value / limit.value + 1);

  watch(() => [offset.value, includeDeleted.value], () => {
    list()
  })

  return {
    data,
    userId,
    currentPage,
    limit,
    offset,
    includeDeleted,
    totalCount,
    loading,
    error,
    taskId,
    list,
    listByUser,
    get,
    create,
    update,
    deleteTaskActivity,
    resetState,
  };
});
