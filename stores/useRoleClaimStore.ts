import { defineStore } from "pinia";
import { roleClaimServiceFactory } from "~/services/identity/roleClaimServiceFactory";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import type { ListRequest, CreateRoleClaimsRequest, RoleClaimsDto } from "~/types/request.types";

export const useRoleClaimStore = defineStore("roleClaim", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();
  const roleClaims: Ref<RoleClaimsDto[]> = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  async function createRoleClaim(data: CreateRoleClaimsRequest) {
    isLoading.value = true;
    try {
      await roleClaimServiceFactory.create(data)
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
      const res = await roleClaimServiceFactory.get(id);
      return res;
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function list(roleId: string, params: ListRequest = { limit: 20, offset: 0, includeDeleted: false }) {
    isLoading.value = true;
    try {
      const req: ListRequest = {
        limit: params.limit ?? 20,
        offset: params.offset ?? 0,
        includeDeleted: params.includeDeleted ?? false
      };
      const res = await roleClaimServiceFactory
        .list(roleId, req).execute();
      roleClaims.value = res as RoleClaimsDto[];
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
