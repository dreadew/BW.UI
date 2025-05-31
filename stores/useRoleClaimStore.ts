import { defineStore } from "pinia";
import { roleClaimServiceFactory } from "~/services/identity/roleClaimServiceFactory";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import type { CreateUserRoleClaimsRequest } from "~/types/request.types";
import type { UserRoleClaim } from "~/types/response.types";

export const useRoleClaimStore = defineStore("roleClaim", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const roleClaims: Ref<UserRoleClaim[]> = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function createRoleClaim(data: CreateUserRoleClaimsRequest) {
    isLoading.value = true;
    try {
      await roleClaimServiceFactory
        .createRoleClaim(data)
        .ensured("Разрешение успешно создано");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteRoleClaim(id: string) {
    isLoading.value = true;
    try {
      await roleClaimServiceFactory
        .deleteRoleClaim(id)
        .ensured("Разрешение успешно удалено");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function get(id: string) {
    isLoading.value = true;
    try {
      const res = await roleClaimServiceFactory.getRoleClaim(id);
      return res;
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function list(roleId: string) {
    isLoading.value = true;
    try {
      await roleClaimServiceFactory.listRoleClaims(roleId);
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    roleClaims,
    isLoading,
    error,
    createRoleClaim,
    deleteRoleClaim,
    get,
    list,
  };
});
