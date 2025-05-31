import { defineStore } from "pinia";
import { roleServiceFactory } from "~/services/identity/roleServiceFactory";
import { useToast } from "vue-toastification";
import { useApiErrorHandler } from "~/utils/apiErrorHandler";
import type { CreateUserRoleRequest, UpdateUserRoleRequest, UserRole } from "~/types/identity/userRole.types";

export const useRoleStore = defineStore("role", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const roles: Ref<UserRole[]> = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function list() {
    isLoading.value = true;
    try {
      const res = await roleServiceFactory
        .list()
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      roles.value = res;
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

  async function create(request: CreateUserRoleRequest) {
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

  async function update(request: UpdateUserRoleRequest) {
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

  return { 
    roles, 
    isLoading, 
    error, 
    list,
    get, 
    create,
    update,
    deleteRole,
    restore
  };
});
