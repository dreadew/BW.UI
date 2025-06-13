import { defineStore } from "pinia";
import { taskServiceFactory } from "~/services/project/taskServiceFactory";
import type {
  AddTaskAssigneeRequest,
  CreateTaskRequest,
  RemoveTaskAssigneeRequest,
  UpdateTaskRequest,
  TaskDto,
  TaskPositionDto,
  ListRequest,
} from "~/types/request.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useTaskStore = defineStore("task", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const sectionId = ref<string | null>(null);
  const userId = ref<string | null>(null);
  const projectId = ref<string | null>(null);
  const data = ref<TaskDto[]>([]);
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

  async function listByProject() {
    resetState();
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
      const res = await taskServiceFactory
        .listByProject(projectId.value, req)
        .execute();
      data.value = res.data;
      totalCount.value = res.totalCount;
      return res;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function listBySection() {
    resetState();
    loading.value = true;
    try {
      if (!sectionId.value) {
        error.value = "Section ID is not set";
        return [];
      }
      const req: ListRequest = {
        limit: limit.value,
        offset: offset.value,
        includeDeleted: includeDeleted.value
      };
      const res = await taskServiceFactory
        .listBySection(sectionId.value, req)
        .execute();
      data.value = res.data;
      totalCount.value = res.totalCount;
      return res;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function listByUser() {
    resetState();
    loading.value = true;
    try {
      if (!userId.value) {
        error.value = "User ID is not set";
        return [];
      }
      const req: ListRequest = {
        limit: limit.value,
        offset: offset.value,
        includeDeleted: includeDeleted.value
      };
      const res = await taskServiceFactory
        .listByUser(userId.value, req)
        .execute();
      data.value = res.data;
      totalCount.value = res.totalCount;
      return res;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function get(taskId: string) {
    loading.value = true;

    try {
      return await taskServiceFactory.get(taskId).execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createTask(request: CreateTaskRequest) {
    resetState();
    loading.value = true;

    try {
      await taskServiceFactory.create(request).ensured("Задача успешно создана");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateTask(request: UpdateTaskRequest) {
    resetState();
    loading.value = true;

    try {
      await taskServiceFactory.update(request).ensured("Задача успешно обновлена");
      await get(request.id);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTask(taskId: string) {
    resetState();
    loading.value = true;

    try {
      await taskServiceFactory.delete(taskId).ensured("Задача успешно удалена");
      await get(taskId);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function restoreTask(taskId: string) {
    resetState();
    loading.value = true;

    try {
      await taskServiceFactory.restore(taskId).ensured("Задача успешно восстановлена");
      await get(taskId);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function addTaskAssignee(request: AddTaskAssigneeRequest) {
    resetState();
    loading.value = true;

    try {
      await taskServiceFactory
        .addTaskAssignee(request)
        .ensured("Исполнитель успешно добавлен к задаче");
      await get(request.id);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function removeTaskAssignee(request: RemoveTaskAssigneeRequest) {
    resetState();
    loading.value = true;

    try {
      await taskServiceFactory
        .removeTaskAssignee(request)
        .ensured("Исполнитель успешно удален из задачи");
      await get(request.id);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function changePosition(request: TaskPositionDto) {
    resetState();
    loading.value = true;

    try {
      await taskServiceFactory
        .changePosition(request)
        .ensured("Исполнитель успешно удален из задачи");
      await get(request.id);
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
    if (sectionId.value) listBySection();
    if (userId.value) listByUser();
    if (projectId.value) listByProject();
  })

  return {
    data,
    loading,
    error,
    limit,
    offset,
    includeDeleted,
    currentPage,
    totalCount,
    projectId,
    listByProject,
    listBySection,
    listByUser,
    reset,
    nextPage,
    prevPage,
    get,
    createTask,
    updateTask,
    deleteTask,
    restoreTask,
    addTaskAssignee,
    removeTaskAssignee,
    changePosition,
    resetState,
  };
});
