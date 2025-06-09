import { defineStore } from "pinia";
import { roleServiceFactory } from "~/services/identity/roleServiceFactory";
import { useApiErrorHandler } from "#imports";
import type { CreateRoleRequest, UpdateRoleRequest, ListRequest, RoleDto } from "~/types/request.types";
import type { UserRole } from "~/types/response.types";
import type { PagingParams } from "~/types/api.types";

export const useRoleStore = defineStore("role", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const roles: Ref<UserRole[]> = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const limit = ref(20);
  const offset = ref(0);

  // Исправить list: ListRequest с includeDeleted
  async function list(params: ListRequest = { limit: limit.value, offset: offset.value, includeDeleted: false }) {
    isLoading.value = true;
    try {
      const req: ListRequest = {
        limit: params.limit ?? limit.value,
        offset: params.offset ?? offset.value,
        includeDeleted: params.includeDeleted ?? false
      };
      const res = await roleServiceFactory.list(req).execute();
      roles.value = res as any; // Приведение к нужному типу, если требуется
      return roles.value;
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
      return await roleServiceFactory
        .get(id)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(request: CreateRoleRequest) {
    isLoading.value = true;
    try {
      await roleServiceFactory
        .create(request)
        .ensured("Роль успешно создана");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(request: UpdateRoleRequest) {
    isLoading.value = true;
    try {
      await roleServiceFactory
        .update(request)
        .ensured("Роль успешно обновлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteRole(id: string) {
    isLoading.value = true;
    try {
      await roleServiceFactory
        .deleteRole(id)
        .ensured("Роль успешно удалена");
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
      await roleServiceFactory
        .restore(id)
        .ensured("Роль успешно восстановлена");
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
    roles,
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
    deleteRole,
    restore
  };
});
