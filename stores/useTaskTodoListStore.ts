import { defineStore } from "pinia";
import { taskTodoListServiceFactory } from "~/services/project/taskTodoListServiceFactory";
import type { CreateTaskTodoListItemRequest, CreateTaskTodoListRequest, ListRequest, UpdateTaskTodoListItemRequest, UpdateTaskTodoListRequest } from "~/types/request.types";
import type { TaskTodoListDto } from "~/types/response.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useTaskTodoListStore = defineStore("taskTodoList", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const todoLists = ref<TaskTodoListDto[]>([]);
  const currentTodoList = ref<TaskTodoListDto | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const limit = ref(20);
  const offset = ref(0);

  function resetState() {
    isLoading.value = false;
    error.value = null;
  }

  async function list(taskId: string, params: ListRequest = { limit: limit.value, offset: offset.value, includeDeleted: false }) {
    isLoading.value = true;
    try {
      const req: ListRequest = {
        limit: params.limit ?? limit.value,
        offset: params.offset ?? offset.value,
        includeDeleted: params.includeDeleted ?? false
      };
      const res = await taskTodoListServiceFactory
        .list(taskId, req)
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      todoLists.value = res;
      return todoLists.value;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function get(todoListId: string) {
    isLoading.value = true;

    try {
      return await taskTodoListServiceFactory
        .get(todoListId)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function createTodoList(request: CreateTaskTodoListRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskTodoListServiceFactory
        .createTodoList(request)
        .ensured("Список задач успешно создан");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTodoList(request: UpdateTaskTodoListRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskTodoListServiceFactory
        .updateTodoList(request)
        .ensured("Список задач успешно обновлен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return true;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTodoList(todoListId: string) {
    resetState();
    isLoading.value = true;

    try {
      await taskTodoListServiceFactory
        .deleteTaskTodoList(todoListId)
        .ensured("Список задач успешно удален");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function createTodoListItem(request: CreateTaskTodoListItemRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskTodoListServiceFactory
        .createTaskTodoListItem(request)
        .ensured("Элемент списка успешно создан");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateTodoListItem(request: UpdateTaskTodoListItemRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskTodoListServiceFactory
        .updateTaskTodoListItem(request)
        .ensured("Элемент списка успешно обновлен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTodoListItem(itemId: string) {
    resetState();
    isLoading.value = true;

    try {
      await taskTodoListServiceFactory
        .deleteTaskTodoListItem(itemId)
        .ensured("Элемент списка успешно удален");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function restore(itemId: string) {
    resetState();
    isLoading.value = true;

    try {
      await taskTodoListServiceFactory
        .restoreTaskTodoList(itemId)
        .ensured("Список успешно восстановлен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
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

  return {
    todoLists,
    currentTodoList,
    isLoading,
    error,
    limit,
    offset,
    list,
    setPaging,
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
