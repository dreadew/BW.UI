import { defineStore } from "pinia";
import { taskTodoListServiceFactory } from "~/services/project/taskTodoListServiceFactory";
import type { CreateTaskTodoListItemRequest, CreateTaskTodoListRequest, ListRequest, TaskTodoListDto, UpdateTaskTodoListItemRequest, UpdateTaskTodoListRequest } from "~/types/request.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useTaskTodoListStore = defineStore("taskTodoList", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const taskId = ref<string | null>(null);
  const data = ref<TaskTodoListDto[]>([]);
  const currentTodoList = ref<TaskTodoListDto | null>(null);
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
      const req: ListRequest = {
        limit: limit.value,
        offset: offset.value,
        includeDeleted: includeDeleted.value,
      };
      const res = await taskTodoListServiceFactory
        .list(taskId.value, req)
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

  async function get(todoListId: string) {
    loading.value = true;

    try {
      return await taskTodoListServiceFactory
        .get(todoListId)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createTodoList(request: CreateTaskTodoListRequest) {
    resetState();
    loading.value = true;

    try {
      await taskTodoListServiceFactory
        .createTodoList(request)
        .ensured("Список задач успешно создан");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateTodoList(request: UpdateTaskTodoListRequest) {
    resetState();
    loading.value = true;

    try {
      await taskTodoListServiceFactory
        .updateTodoList(request)
        .ensured("Список задач успешно обновлен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTodoList(todoListId: string) {
    resetState();
    loading.value = true;

    try {
      await taskTodoListServiceFactory
        .deleteTaskTodoList(todoListId)
        .ensured("Список задач успешно удален");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function createTodoListItem(request: CreateTaskTodoListItemRequest) {
    resetState();
    loading.value = true;

    try {
      await taskTodoListServiceFactory
        .createTaskTodoListItem(request)
        .ensured("Элемент списка успешно создан");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateTodoListItem(request: UpdateTaskTodoListItemRequest) {
    resetState();
    loading.value = true;

    try {
      await taskTodoListServiceFactory
        .updateTaskTodoListItem(request)
        .ensured("Элемент списка успешно обновлен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTodoListItem(itemId: string) {
    resetState();
    loading.value = true;

    try {
      await taskTodoListServiceFactory
        .deleteTaskTodoListItem(itemId)
        .ensured("Элемент списка успешно удален");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function restore(itemId: string) {
    resetState();
    loading.value = true;

    try {
      await taskTodoListServiceFactory
        .restoreTaskTodoList(itemId)
        .ensured("Список успешно восстановлен");
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
    data,
    currentTodoList,
    taskId,
    currentPage,
    loading,
    error,
    limit,
    offset,
    list,
    includeDeleted,
    totalCount,
    reset,
    nextPage,
    prevPage,
    get,
    createTodoList,
    updateTodoList,
    deleteTodoList,
    restore,
    createTodoListItem,
    updateTodoListItem,
    deleteTodoListItem,
    resetState,
  };
});
