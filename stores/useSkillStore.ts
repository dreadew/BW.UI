import { defineStore } from "pinia";
import { skillServiceFactory } from "~/services/identity/skillsServiceFactory";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import type { CreateSkillRequest, UpdateSkillRequest, SkillDto, ListRequest } from "~/types/request.types";

export const useSkillStore = defineStore("skill", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const data = ref<SkillDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const limit = ref(20);
  const offset = ref(0);
  const includeDeleted = ref(false);
  const totalCount = ref(0);

  async function list() {
    loading.value = true;
    try {
      const req: ListRequest = {
        limit: limit.value,
        offset: offset.value,
        includeDeleted: includeDeleted.value
      };
      const res = await skillServiceFactory
        .list(req)
        .execute();

      data.value = res.data;
      totalCount.value = res.count;
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
      return await skillServiceFactory
        .get(id)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(request: CreateSkillRequest) {
    loading.value = true;
    try {
      await skillServiceFactory
        .create(request)
        .ensured("Навык успешно создан");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function update(request: UpdateSkillRequest) {
    loading.value = true;
    try {
      await skillServiceFactory
        .update(request)
        .ensured("Навык успешно обновлен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteSkill(id: string) {
    loading.value = true;
    try {
      await skillServiceFactory
        .delete(id)
        .ensured("Навык успешно удален");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function restore(id: string) {
    loading.value = true;
    try {
      await skillServiceFactory
        .restore(id)
        .ensured("Навык успешно восстановлен");
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
    loading,
    error,
    limit,
    offset,
    includeDeleted,
    totalCount,
    currentPage,
    list,
    reset,
    nextPage,
    prevPage,
    get,
    create,
    update,
    deleteSkill,
    restore
  };
});
