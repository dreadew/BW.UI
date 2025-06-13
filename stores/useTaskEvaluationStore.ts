import { defineStore } from "pinia";
import { taskEvaluationServiceFactory } from "~/services/project/taskEvaluationServiceFactory";
import type { CreateTaskEvaluationRequest, ListRequest, TaskEvaluationDto, UpdateTaskEvaluationRequest } from "~/types/request.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useTaskEvaluationStore = defineStore("taskEvaluation", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const taskId = ref<string | null>(null);
  const data = ref<TaskEvaluationDto[]>([]);
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
        includeDeleted: includeDeleted.value
      };
      const res = await taskEvaluationServiceFactory
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

  async function get(id: string) {
    loading.value = true;

    try {
      return await taskEvaluationServiceFactory
        .get(id)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(request: CreateTaskEvaluationRequest) {
    resetState();
    loading.value = true;

    try {
      await taskEvaluationServiceFactory
        .create(request)
        .ensured("Оценка задачи успешно создана");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function update(request: UpdateTaskEvaluationRequest) {
    resetState();
    loading.value = true;

    try {
      await taskEvaluationServiceFactory
        .update(request)
        .ensured("Оценка задачи успешно обновлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteEvaluation(evaluationId: string) {
    resetState();
    loading.value = true;

    try {
      await taskEvaluationServiceFactory
        .delete(evaluationId)
        .ensured("Оценка задачи успешно удалена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function restore(evaluationId: string) {
    resetState();
    loading.value = true;

    try {
      await taskEvaluationServiceFactory
        .restore(evaluationId)
        .ensured("Оценка задачи успешно восстановлена");
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
    taskId,
    data,
    loading,
    error,
    limit,
    offset,
    currentPage,
    includeDeleted,
    totalCount,
    list,
    reset,
    nextPage,
    prevPage,
    get,
    create,
    update,
    deleteEvaluation,
    restore,
    resetState,
  };
});
