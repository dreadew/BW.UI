import { defineStore } from "pinia";
import { roleClaimServiceFactory } from "~/services/identity/roleClaimServiceFactory";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";
import type { ListRequest, CreateRoleClaimsRequest, RoleClaimsDto } from "~/types/request.types";

export const useRoleClaimStore = defineStore("roleClaim", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const data: Ref<RoleClaimsDto[]> = ref([]);
  const roleId = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const limit = ref(20);
  const offset = ref(0);

  async function createRoleClaim(data: CreateRoleClaimsRequest) {
    loading.value = true;
    try {
      await roleClaimServiceFactory.create(data)
        .ensured("Разрешение успешно создано");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteRoleClaim(id: string) {
    loading.value = true;
    try {
      await roleClaimServiceFactory
        .deleteRoleClaim(id)
        .ensured("Разрешение успешно удалено");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function get(id: string) {
    loading.value = true;
    try {
      const res = await roleClaimServiceFactory.get(id);
      return res;
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function list() {
    loading.value = true;
    try {
      if (!roleId.value) {
        error.value = "Role ID is required";
        return;
      }
      const req: ListRequest = {
        limit: limit.value,
        offset: offset.value,
        includeDeleted: false
      };
      const res = await roleClaimServiceFactory
        .list(roleId.value, req).execute();
      data.value = res.data;
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    loading,
    error,
    limit,
    offset,
    roleId,
    createRoleClaim,
    deleteRoleClaim,
    get,
    list,
  };
});
