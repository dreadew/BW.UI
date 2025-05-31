import { defineStore } from "pinia";
import { projectRoleServiceFactory } from "~/services/project/projectRoleServiceFactory";
import type {
  CreateProjectRoleRequest,
  UpdateProjectRoleRequest,
} from "~/types/request.types";
import type { ProjectRoleDto } from "~/types/response.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useProjectRoleStore = defineStore("projectRole", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const projectRoles = ref<ProjectRoleDto[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  function resetState() {
    isLoading.value = false;
    error.value = null;
  }

  async function listByProject(projectId: string) {
    resetState();
    isLoading.value = true;

    try {
      const res = await projectRoleServiceFactory
        .list(projectId)
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      projectRoles.value = res;
      return projectRoles.value;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function get(roleId: string) {
    resetState();
    isLoading.value = true;

    try {
      return await projectRoleServiceFactory
        .get(roleId)
        .ensured();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(request: CreateProjectRoleRequest) {
    resetState();
    isLoading.value = true;

    try {
      await projectRoleServiceFactory
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

  async function update(request: UpdateProjectRoleRequest) {
    resetState();
    isLoading.value = true;

    try {
      await projectRoleServiceFactory
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

  async function deleteRole(roleId: string) {
    resetState();
    isLoading.value = true;

    try {
      await projectRoleServiceFactory
        .delete(roleId)
        .ensured("Роль успешно удалена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function restore(roleId: string) {
    resetState();
    isLoading.value = true;

    try {
      await projectRoleServiceFactory
        .restore(roleId)
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
    projectRoles,
    isLoading,
    error,
    listByProject,
    get,
    create,
    update,
    deleteRole,
    restore,
    resetState,
  };
});
