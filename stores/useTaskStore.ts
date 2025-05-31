import { defineStore } from "pinia";
import { taskServiceFactory } from "~/services/project/taskServiceFactory";
import type {
  AddTaskAssigneeRequest,
  CreateTaskRequest,
  RemoveTaskAssigneeRequest,
  TaskDto,
  TaskPositionDto,
  UpdateTaskRequest,
} from "~/types/project/task.types";
import { useApiErrorHandler } from "~/utils/apiErrorHandler";
import { useToast } from "vue-toastification";

export const useTaskStore = defineStore("task", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const tasks = ref<TaskDto[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  function resetState() {
    isLoading.value = false;
    error.value = null;
  }

  async function listByProject(projectId: string) {
    resetState();
    isLoading.value = true;

    try {
      const res = await taskServiceFactory
        .listByProject(projectId, {})
        .execute();
      
      if (!res || res.length === 0) {
        return;
      }
      
      tasks.value = res;
    } catch (err) {
      errorHandler.handleError(err);
    } finally {
      isLoading.value = false;
    }
  }

  async function listBySection(sectionId: string) {
    resetState();
    isLoading.value = true;

    try {
      const res = await taskServiceFactory
        .listBySection(sectionId, {})
        .execute();
      
      if (!res || res.length === 0) {
        return;
      }
      
      tasks.value = res;
    } catch (err) {
      errorHandler.handleError(err);
    } finally {
      isLoading.value = false;
    }
  }

  async function get(taskId: string) {
    isLoading.value = true;

    try {
      return await taskServiceFactory
        .get(taskId)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function createTask(request: CreateTaskRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskServiceFactory
        .create(request)
        .ensured("Задача успешно создана");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTask(request: UpdateTaskRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskServiceFactory
        .update(request)
        .ensured("Задача успешно обновлена");
      await get(request.id);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTask(taskId: string) {
    resetState();
    isLoading.value = true;

    try {
      await taskServiceFactory
        .delete(taskId)
        .ensured("Задача успешно удалена");
      await get(taskId);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function restoreTask(taskId: string) {
    resetState();
    isLoading.value = true;

    try {
      await taskServiceFactory
        .restore(taskId)
        .ensured("Задача успешно восстановлена");
      await get(taskId);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function addTaskAssignee(request: AddTaskAssigneeRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskServiceFactory
        .addTaskAssignee(request)
        .ensured("Исполнитель успешно добавлен к задаче");
      await get(request.taskId);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeTaskAssignee(request: RemoveTaskAssigneeRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskServiceFactory
        .removeTaskAssignee(request)
        .ensured("Исполнитель успешно удален из задачи");
      await get(request.taskId);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function changePosition(request: TaskPositionDto) {
    resetState();
    isLoading.value = true;

    try {
      await taskServiceFactory
        .changePosition(request)
        .ensured("Исполнитель успешно удален из задачи");
      await get(request.taskId);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    tasks,
    isLoading,
    error,
    listByProject,
    listBySection,
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
