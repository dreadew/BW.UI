import { defineStore } from "pinia";
import { skillServiceFactory } from "~/services/identity/skillsServiceFactory";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import type { CreateSkillRequest, UpdateSkillRequest } from "~/types/request.types";
import type { Skill } from "~/types/response.types";
import type { PagingParams } from "~/types/api.types";

export const useSkillStore = defineStore("skill", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const skills: Ref<Skill[]> = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const limit = ref(20);
  const offset = ref(0);

  async function list(params: PagingParams = {}) {
    isLoading.value = true;
    try {
      const res = await skillServiceFactory
        .list({ limit: params.limit ?? limit.value, offset: params.offset ?? offset.value })
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      skills.value = res;
      return skills.value;
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
      return await skillServiceFactory
        .get(id)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(request: CreateSkillRequest) {
    isLoading.value = true;
    try {
      await skillServiceFactory
        .create(request)
        .ensured("Навык успешно создан");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(request: UpdateSkillRequest) {
    isLoading.value = true;
    try {
      await skillServiceFactory
        .update(request)
        .ensured("Навык успешно обновлен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteSkill(id: string) {
    isLoading.value = true;
    try {
      await skillServiceFactory
        .delete(id)
        .ensured("Навык успешно удален");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function restore(id: string) {
    isLoading.value = true;
    try {
      await skillServiceFactory
        .restore(id)
        .ensured("Навык успешно восстановлен");
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
    skills,
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
    deleteSkill,
    restore
  };
});
