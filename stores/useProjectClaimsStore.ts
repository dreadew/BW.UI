import { defineStore } from "pinia";
import { projectRoleClaimsServiceFactory } from "~/services/project/projectRoleClaimsServiceFactory";
import { useApiErrorHandler } from "~/utils/apiErrorHandler";
import { useToast } from "vue-toastification";
import type {
  CreateProjectRoleClaimsRequest,
  ProjectRoleClaimsDto,
} from "~/types/project/projectRoleClaimsService.types";

export const useProjectClaimsStore = defineStore("projectClaims", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const projectClaims = ref<ProjectRoleClaimsDto[]>([]);
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
      projectClaims.value = res;
      return res;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function addProjectClaim(
    projectId: string,
    dto: CreateProjectRoleClaimsRequest
  ) {
    resetState();
    isLoading.value = true;

    try {
      await projectRoleClaimsServiceFactory
        .create(dto)
        .ensured("Разрешение успешно добавлено");

      await list(projectId);
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeProjectClaim(id: string) {
    resetState();
    isLoading.value = true;

    try {
      await projectRoleClaimsServiceFactory
        .delete(id)
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
    projectClaims,
    isLoading,
    error,
    list,
    addProjectClaim,
    removeProjectClaim,
    resetState,
  };
});
