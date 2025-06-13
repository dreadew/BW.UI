import { defineStore } from "pinia";
import { projectRoleServiceFactory } from "~/services/project/projectRoleServiceFactory";
import type {
  CreateProjectRoleRequest,
  UpdateProjectRoleRequest,
  ProjectRoleDto,
  ListRequest,
} from "~/types/request.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useProjectRoleStore = defineStore("projectRole", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const projectId = ref<string | null>(null);
  const data = ref<ProjectRoleDto[]>([]);
  const loading = ref(false);
  const offset = ref(0);
  const limit = ref(20);
  const includeDeleted = ref(false);
  const totalCount = ref(0);
  const error = ref<string | null>(null);

  function resetState() {
    loading.value = false;
    error.value = null;
  }

  async function list() {
    loading.value = true;
    try {
      if (!projectId.value) {
        error.value = "Project ID is not set";
        return [];
      }
      const req: ListRequest = {
        limit: limit.value,
        offset: offset.value,
        includeDeleted: includeDeleted.value
      };
      const res = await projectRoleServiceFactory
        .list(projectId.value, req)
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

  async function get(roleId: string) {
    resetState();
    loading.value = true;

    try {
      return await projectRoleServiceFactory
        .get(roleId)
        .ensured();
    } catch (err) {
      errorHandler.handleError(err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(request: CreateProjectRoleRequest) {
    resetState();
    loading.value = true;

    try {
      await projectRoleServiceFactory
        .create(request)
        .ensured("Роль успешно создана");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function update(request: UpdateProjectRoleRequest) {
    resetState();
    loading.value = true;

    try {
      await projectRoleServiceFactory
        .update(request)
        .ensured("Роль успешно обновлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function deleteRole(roleId: string) {
    resetState();
    loading.value = true;

    try {
      await projectRoleServiceFactory
        .delete(roleId)
        .ensured("Роль успешно удалена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function restore(roleId: string) {
    resetState();
    loading.value = true;

    try {
      await projectRoleServiceFactory
        .restore(roleId)
        .ensured("Роль успешно восстановлена");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  const currentPage = computed(() => offset.value / limit.value + 1);

  watch(() => [offset.value, includeDeleted.value], () => {
    list()
  })

  return {
    data,
    loading,
    error,
    limit,
    offset,
    currentPage,
    includeDeleted,
    totalCount,
    projectId,
    list,
    get,
    create,
    update,
    deleteRole,
    restore,
    resetState,
  };
});
