import { defineStore } from "pinia";
import { projectServiceFactory } from "~/services/project/projectServiceFactory";
import type { ListRequest, CreateProjectRequest, UpdateProjectRequest, DeleteProjectRequest, ProjectDto, AddProjectUserRequest, DeleteProjectUserRequest, FileDeleteRequest } from "~/types/request.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useProjectStore = defineStore("project", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();
  
  const data = ref<ProjectDto[]>([]);
  const totalCount = ref(0);
  const offset = ref(0);
  const limit = ref(20);
  const includeDeleted = ref(false);
  const userId = ref<string | null>(null);
  const workspaceId = ref<string | null>(null);
  const currentProject = ref<ProjectDto | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function resetState() {
    loading.value = false;
    error.value = null;
  }

  async function listByUser() {
    resetState();
    loading.value = true;

    try {
      if (!userId.value) {
        error.value = "User ID is not set";
        return [];
      }
      const res = await projectServiceFactory
        .listByUser(userId.value, {
          offset: offset.value,
          limit: limit.value,
          includeDeleted: includeDeleted.value
        })
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

  async function listByWorkspace() {
    resetState();
    loading.value = true;
    try {
      if (!workspaceId.value) {
        error.value = "Workspace ID is not set";
        return [];
      }
      const res = await projectServiceFactory
        .listByWorkspace(workspaceId.value, {
          offset: offset.value,
          limit: limit.value,
          includeDeleted: includeDeleted.value
        })
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
      const res = await projectServiceFactory
        .get(id)
        .execute();
      currentProject.value = res;
      return currentProject.value;
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(request: CreateProjectRequest) {
    resetState();
    loading.value = true;

    try {
      await projectServiceFactory
        .create(request)
        .ensured("Проект успешно создан");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function update(request: UpdateProjectRequest) {
    resetState();
    loading.value = true;

    try {
      await projectServiceFactory
        .update(request)
        .ensured("Проект успешно обновлен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProject(request: DeleteProjectRequest) {
    resetState();
    loading.value = true;

    try {
      await projectServiceFactory
        .delete(request)
        .ensured("Проект успешно удален");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function restore(request: DeleteProjectRequest) {
    resetState();
    loading.value = true;

    try {
      await projectServiceFactory
        .restore(request)
        .ensured("Проект успешно восстановлен");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function addUser(dto: AddProjectUserRequest) {
    loading.value = true;
    try {
      await projectServiceFactory
        .addUser(dto)
        .ensured("Пользователь успешно добавлен в проект");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(dto: DeleteProjectUserRequest) {
    loading.value = true;
    try {
      await projectServiceFactory
        .deleteUser(dto)
        .ensured("Пользователь успешно удален из проекта");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function uploadPicture(id: string, file: File) {
    loading.value = true;
    try {
      await projectServiceFactory
        .uploadPicture(id, file)
        .ensured("Изображение успешно загружено");
    } finally {
      loading.value = false;
    }
  }

  async function deletePicture(id: string, params: FileDeleteRequest) {
    loading.value = true;
    try {
      await projectServiceFactory
        .deletePicture(id, params)
        .ensured("Изображение успешно удалено");
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

  const currentPage = computed(() => offset.value / limit.value + 1);

  watch(() => [offset.value, includeDeleted.value], () => {
    if (userId.value) listByUser();
    if (workspaceId.value) listByWorkspace();
  })

  return {
    userId,
    workspaceId,
    data,
    limit,
    offset,
    includeDeleted,
    totalCount,
    currentProject,
    reset,
    loading,
    error,
    listByUser,
    listByWorkspace,
    currentPage,
    nextPage,
    prevPage,
    get,
    create,
    update,
    deleteProject,
    restore,
    addUser,
    deleteUser,
    uploadPicture,
    deletePicture,
    resetState
  };
});
