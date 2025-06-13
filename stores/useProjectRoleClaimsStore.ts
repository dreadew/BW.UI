import { defineStore } from "pinia";
import { projectRoleClaimsServiceFactory } from "~/services/project/projectRoleClaimsServiceFactory";
import type { CreateProjectRoleClaimsRequest, UpdateProjectRoleClaimsRequest, ProjectRoleClaimsDto, ListRequest } from "~/types/request.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useProjectRoleClaimsStore = defineStore(
  "projectRoleClaims",
  () => {
    const toast = useToast();
    const errorHandler = useApiErrorHandler();

    const data = ref<ProjectRoleClaimsDto[]>([]);
    const roleId = ref<string | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const limit = ref(20);
    const offset = ref(0);
    const includeDeleted = ref(false);
    const totalCount = ref(0);

    function resetState() {
      loading.value = false;
      error.value = null;
    }

    async function list() {
      loading.value = true;
      try {
        if (!roleId.value) {
          error.value = "Role ID is not set";
          return [];
        }
        const req: ListRequest = {
          limit: limit.value,
          offset: offset.value,
          includeDeleted: includeDeleted.value
        };
        const res = await projectRoleClaimsServiceFactory
          .listByRole(roleId.value, req)
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
        return await projectRoleClaimsServiceFactory.get(id).execute();
      } catch (err) {
        errorHandler.handleError(err);
        return [];
      } finally {
        loading.value = false;
      }
    }

    async function create(request: CreateProjectRoleClaimsRequest) {
      resetState();
      loading.value = true;

      try {
        await projectRoleClaimsServiceFactory
          .create(request)
          .ensured("Разрешение успешно добавлено");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        loading.value = false;
      }
    }

    async function update(request: UpdateProjectRoleClaimsRequest) {
      resetState();
      loading.value = true;

      try {
        await projectRoleClaimsServiceFactory
          .update(request)
          .ensured("Разрешение успешно обновлено");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        loading.value = false;
      }
    }

    async function deleteClaim(claimId: string) {
      resetState();
      loading.value = true;

      try {
        await projectRoleClaimsServiceFactory
          .delete(claimId)
          .ensured("Разрешение успешно удалено");
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

    return {
      data,
      loading,
      error,
      limit,
      offset,
      includeDeleted,
      totalCount,
      roleId,
      list,
      reset,
      nextPage,
      prevPage,
      get,
      create,
      update,
      deleteClaim,
      resetState,
    };
  }
);
