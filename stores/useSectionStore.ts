import { defineStore } from "pinia";
import { sectionServiceFactory } from "~/services/project/sectionServiceFactory";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import type { CreateSectionRequest, UpdateSectionRequest, SectionDto, ListRequest } from "~/types/request.types";

export const useSectionStore = defineStore("section", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const data: Ref<SectionDto[]> = ref([]);
  const projectId: Ref<string | null> = ref(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const limit = ref(20);
  const offset = ref(0);
  const includeDeleted = ref(false);
  const totalCount = ref(0);

  async function listByProject() {
    loading.value = true;
    try {
      if (!projectId.value) {
        error.value = "Project ID is not set";
        return [];
      }
      const req: ListRequest = {
        limit: limit.value,
        offset: offset.value,
        includeDeleted: includeDeleted.value
      };
      const res = await sectionServiceFactory
        .listByProject(projectId.value!, req)
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
      return await sectionServiceFactory
        .get(id)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(data: CreateSectionRequest) {
    loading.value = true;
    try {
      await sectionServiceFactory
        .create(data)
        .ensured("Секция создана");
      await listByProject();
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function update(data: UpdateSectionRequest) {
    loading.value = true;
    try {
      await sectionServiceFactory
        .update(data)
        .ensured("Секция обновлена");
      await listByProject();
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteSection(id: string) {
    loading.value = true;
    try {
      await sectionServiceFactory
        .deleteSection(id)
        .ensured("Секция удалена");
      await listByProject();
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
      await sectionServiceFactory
        .restore(id)
        .ensured("Секция восстановлена");
      await listByProject();
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
    listByProject()
  })

  return {
    data,
    projectId,
    loading,
    currentPage,
    error,
    limit,
    offset,
    includeDeleted,
    totalCount,
    listByProject,
    reset,
    nextPage,
    prevPage,
    get,
    create,
    update,
    deleteSection,
    restore,
  };
});
