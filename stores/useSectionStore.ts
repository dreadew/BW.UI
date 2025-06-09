import { defineStore } from "pinia";
import { sectionServiceFactory } from "~/services/project/sectionServiceFactory";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import type { CreateSectionRequest, UpdateSectionRequest, SectionDto, ListRequest } from "~/types/request.types";

export const useSectionStore = defineStore("section", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const sections: Ref<SectionDto[]> = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const limit = ref(20);
  const offset = ref(0);

  async function listByProject(projectId: string, params: ListRequest = { limit: limit.value, offset: offset.value, includeDeleted: false }) {
    isLoading.value = true;
    try {
      const req: ListRequest = {
        limit: params.limit ?? limit.value,
        offset: params.offset ?? offset.value,
        includeDeleted: params.includeDeleted ?? false
      };
      const res = await sectionServiceFactory
        .listByProject(projectId, req)
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
    limit,
    offset,
    listByProject,
    setPaging,
    nextPage,
    prevPage,
    get,
    create,
    update,
    deleteSection,
    restore,
  };
});
