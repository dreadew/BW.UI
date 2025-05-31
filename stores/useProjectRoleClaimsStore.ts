import { defineStore } from "pinia";
import { projectRoleClaimsServiceFactory } from "~/services/project/projectRoleClaimsServiceFactory";
import type {
  CreateProjectRoleClaimsRequest,
  UpdateProjectRoleClaimsRequest,
} from "~/types/request.types";
import type { ProjectRoleClaimsDto } from "~/types/response.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useProjectRoleClaimsStore = defineStore(
  "projectRoleClaims",
  () => {
    const toast = useToast();
    const errorHandler = useApiErrorHandler();

    const roleClaims = ref<ProjectRoleClaimsDto[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    function resetState() {
      isLoading.value = false;
      error.value = null;
    }

    async function list(roleId: string) {
      resetState();
      isLoading.value = true;

      try {
        const res = await projectRoleClaimsServiceFactory
          .listByRole(roleId)
          .execute();
        if (!res || res.length === 0) {
          return [];
        }
        roleClaims.value = res;
        return roleClaims.value;
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
        return await projectRoleClaimsServiceFactory
          .get(id)
          .execute();
      } catch (err) {
        errorHandler.handleError(err);
        return [];
      } finally {
        isLoading.value = false;
      }
    }

    async function create(request: CreateProjectRoleClaimsRequest) {
      resetState();
      isLoading.value = true;

      try {
        await projectRoleClaimsServiceFactory
          .create(request)
          .ensured("Разрешение успешно добавлено");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    async function update(request: UpdateProjectRoleClaimsRequest) {
      resetState();
      isLoading.value = true;

      try {
        await projectRoleClaimsServiceFactory
          .update(request)
          .ensured("Разрешение успешно обновлено");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    async function deleteClaim(claimId: string) {
      resetState();
      isLoading.value = true;

      try {
        await projectRoleClaimsServiceFactory
          .delete(claimId)
          .ensured("Разрешение успешно удалено");
        return true;
      } catch (err) {
        errorHandler.handleError(err);
        return false;
      } finally {
        isLoading.value = false;
      }
    }

    return {
      roleClaims,
      isLoading,
      error,
      list,
      get,
      create,
      update,
      deleteClaim,
      resetState,
    };
  }
);
