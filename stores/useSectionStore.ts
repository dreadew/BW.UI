import { defineStore } from "pinia";
import { sectionServiceFactory } from "~/services/project/sectionServiceFactory";
import { useToast } from "vue-toastification";
import { useApiErrorHandler } from "~/utils/apiErrorHandler";
import type { CreateSectionRequest, SectionDto, UpdateSectionRequest } from "~/types/project/section.types";

export const useSectionStore = defineStore("section", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const sections: Ref<SectionDto[]> = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function listByProject(projectId: string) {
    isLoading.value = true;
    try {
      const res = await sectionServiceFactory
        .listByProject(projectId)
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      sections.value = res;
      return sections.value;
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
      return await sectionServiceFactory
        .get(id)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(data: CreateSectionRequest) {
    isLoading.value = true;
    try {
      await sectionServiceFactory
        .create(data)
        .ensured("Секция создана");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(data: UpdateSectionRequest) {
    isLoading.value = true;
    try {
      await sectionServiceFactory
        .update(data)
        .ensured("Секция обновлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteSection(id: string) {
    isLoading.value = true;
    try {
      await sectionServiceFactory
        .deleteSection(id)
        .ensured("Секция удалена");
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
      await sectionServiceFactory
        .restore(id)
        .ensured("Секция восстановлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return { 
    sections, 
    isLoading, 
    error, 
    listByProject,
    get,
    create, 
    update,
    deleteSection,
    restore,
  };
});
