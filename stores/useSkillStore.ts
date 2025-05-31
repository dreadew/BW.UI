import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { skillServiceFactory } from "~/services/identity/skillsServiceFactory";
import type { CreateSkillRequest, Skill, UpdateSkillRequest } from "~/types/identity/skill.types";
import { useApiErrorHandler } from "~/utils/apiErrorHandler";

export const useSkillStore = defineStore("skill", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const skills: Ref<Skill[]> = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function list() {
    isLoading.value = true;
    try {
      const res = await skillServiceFactory 
        .list()
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

  return { 
    skills, 
    isLoading, 
    error, 
    list, 
    get,
    create,
    update,
    deleteSkill,
    restore
  };
});
