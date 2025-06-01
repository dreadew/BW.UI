import { defineStore } from "pinia";
import { projectServiceFactory } from "~/services/project/projectServiceFactory";
import type { PagingParams } from "~/types/api.types";
import type {
  AddUserRequest,
  CreateProjectRequest,
  DeleteProjectRequest,
  DeleteUserRequest,
  UpdateProjectRequest,
} from "~/types/request.types";
import type { ProjectDto } from "~/types/response.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useProjectStore = defineStore("project", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const projects = ref<ProjectDto[]>([]);
  const currentProject = ref<ProjectDto | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  function resetState() {
    isLoading.value = false;
    error.value = null;
  }

  async function listByUser(userId: string, params: PagingParams) {
    resetState();
    isLoading.value = true;

    try {
      const res = await projectServiceFactory
        .listByUser(userId, params)
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      projects.value = res;
      return projects.value;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  async function listByWorkspace(workspaceId: string) {
    resetState();
    isLoading.value = true;

    try {
      const res = await projectServiceFactory
        .listByWorkspace(workspaceId, {})
        .execute();
      if (!res || res.length === 0) {
        return [];
      }
      projects.value = res;
      return projects.value;
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
      return await projectServiceFactory
        .get(id)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function create(request: CreateProjectRequest) {
    resetState();
    isLoading.value = true;

    try {
      await projectServiceFactory
        .create(request)
        .ensured("Проект успешно создан");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function update(request: UpdateProjectRequest) {
    resetState();
    isLoading.value = true;

    try {
      await projectServiceFactory
        .update(request)
        .ensured("Проект успешно обновлен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteProject(request: DeleteProjectRequest) {
    resetState();
    isLoading.value = true;

    try {
      await projectServiceFactory
        .delete(request)
        .ensured("Проект успешно удален");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function restore(request: DeleteProjectRequest) {
    resetState();
    isLoading.value = true;

    try {
      await projectServiceFactory
        .restore(request)
        .ensured("Проект успешно восстановлен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function addUser(projectId: string, userId: string) {
    isLoading.value = true;
    try {
      await projectServiceFactory
        .addUser(projectId, userId)
        .ensured("Пользователь успешно добавлен в проект");
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteUser(projectId: string, userId: string) {
    isLoading.value = true;
    try {
      await projectServiceFactory
        .deleteUser(projectId, userId)
        .ensured("Пользователь успешно удален из проекта");
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    projects,
    currentProject,
    isLoading,
    error,
    listByUser,
    listByWorkspace,
    get,
    create,
    update,
    deleteProject,
    restore,
    addUser,
    deleteUser,
    resetState
  };
});
