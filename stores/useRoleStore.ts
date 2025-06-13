import { defineStore } from "pinia";
import { roleServiceFactory } from "~/services/identity/roleServiceFactory";
import { useApiErrorHandler } from "#imports";
import type { CreateRoleRequest, UpdateRoleRequest, ListRequest, RoleDto } from "~/types/request.types";

export const useRoleStore = defineStore("role", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const data: Ref<RoleDto[]> = ref([]);
  const loading = ref(false);
  const error = ref(null);
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
      const res = await roleServiceFactory.list(req).execute();
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
      return await roleServiceFactory
        .get(id)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(request: CreateRoleRequest) {
    loading.value = true;
    try {
      await roleServiceFactory
        .create(request)
        .ensured("Роль успешно создана");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function update(request: UpdateRoleRequest) {
    loading.value = true;
    try {
      await roleServiceFactory
        .update(request)
        .ensured("Роль успешно обновлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteRole(id: string) {
    loading.value = true;
    try {
      await roleServiceFactory
        .deleteRole(id)
        .ensured("Роль успешно удалена");
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
      await roleServiceFactory
        .restore(id)
        .ensured("Роль успешно восстановлена");
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
    totalCount,
    currentPage,
    includeDeleted,
    error,
    limit,
    offset,
    list,
    reset,
    nextPage,
    prevPage,
    get,
    create,
    update,
    deleteRole,
    restore
  };
});
