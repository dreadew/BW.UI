import { defineStore } from "pinia";
import { taskEvaluationServiceFactory } from "~/services/project/taskEvaluationServiceFactory";
import type { CreateTaskEvaluationRequest, ListRequest, TaskEvaluationDto, UpdateTaskEvaluationRequest } from "~/types/request.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useTaskEvaluationStore = defineStore("taskEvaluation", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const evaluations = ref<TaskEvaluationDto[]>([]);
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
      const res = await taskEvaluationServiceFactory
        .list(taskId, req)
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      evaluations.value = res;
      return evaluations.value;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function get(id: string) {
    isLoading.value = true;

    try {
      return await taskEvaluationServiceFactory
        .get(id)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(request: CreateTaskEvaluationRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskEvaluationServiceFactory
        .create(request)
        .ensured("Оценка задачи успешно создана");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(request: UpdateTaskEvaluationRequest) {
    resetState();
    isLoading.value = true;

    try {
      await taskEvaluationServiceFactory
        .update(request)
        .ensured("Оценка задачи успешно обновлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteEvaluation(evaluationId: string) {
    resetState();
    isLoading.value = true;

    try {
      await taskEvaluationServiceFactory
        .delete(evaluationId)
        .ensured("Оценка задачи успешно удалена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function restore(evaluationId: string) {
    resetState();
    isLoading.value = true;

    try {
      await taskEvaluationServiceFactory
        .restore(evaluationId)
        .ensured("Оценка задачи успешно восстановлена");
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
    evaluations,
    isLoading,
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
    deleteEvaluation,
    restore,
    resetState,
  };
});
