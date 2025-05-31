import { defineStore } from "pinia";
import { taskTodoListServiceFactory } from "~/services/project/taskTodoListServiceFactory";
import type {
  CreateTaskTodoListRequest,
  CreateTaskTodoListItemRequest,
  TaskTodoListDto,
  UpdateTaskTodoListRequest,
  UpdateTaskTodoListItemRequest,
} from "~/types/project/taskTodoList.types";
import { useApiErrorHandler } from "~/utils/apiErrorHandler";
import { useToast } from "vue-toastification";

export const useTaskTodoListStore = defineStore("taskTodoList", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const todoLists = ref<TaskTodoListDto[]>([]);
  const currentTodoList = ref<TaskTodoListDto | null>(null);
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
      const res = await taskTodoListServiceFactory
        .list(taskId)
        .execute();
      
      if (!res || res.length === 0) {
        toast.info("Список задач пуст");
        return;
      }
      
      todoLists.value = res;
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
    } catch(err) {
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

  return {
    todoLists,
    currentTodoList,
    isLoading,
    error,
    list,
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
