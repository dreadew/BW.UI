import { workspaceRoleServiceFactory } from "~/services/workspace/workspaceRoleServiceFactory";
import type { CreateWorkspaceRoleRequest, UpdateWorkspaceRoleRequest, ListRequest, WorkspaceRoleDto } from "~/types/request.types";
import type { WorkspaceRole } from "~/types/response.types";

export const useWorkspaceRoleStore = defineStore("WorkspaceRole", () => {
  const roles = ref<WorkspaceRole[]>([]);
  const total = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(25);
  const loading = ref(false);
  const currentRole = ref<WorkspaceRole | null>(null);

  async function list(workspaceId: string, params: ListRequest = { limit: pageSize.value, offset: 0, includeDeleted: false }) {
    reset();
    loading.value = true;
    try {
      const req: ListRequest = {
        ...params,
        limit: params.limit ?? pageSize.value,
        offset: params.offset ?? 0,
        includeDeleted: params.includeDeleted ?? false
      };
      const resp = await workspaceRoleServiceFactory.listWorkspaceRoles(workspaceId, req).execute();
      roles.value = resp as any; // Приведение к нужному типу, если требуется
      total.value = resp.length;
      if (resp.length == pageSize.value) {
        currentPage.value++;
      }
    } catch (error) {
      console.error("Error fetching workspace roles:", error);
    } finally {
      loading.value = false;
    }
  }

  async function get(id: string) {
    loading.value = true;
    try {
      const resp = await workspaceRoleServiceFactory
        .getWorkspaceRole(id)
        .execute();
      currentRole.value = resp as any;
      return resp;
    } catch (error) {
      console.error("Error fetching workspace role:", error);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function create(body: CreateWorkspaceRoleRequest) {
    loading.value = true;
    try {
      await workspaceRoleServiceFactory
        .createWorkspaceRole(body)
        .ensured("Роль успешно создана");
    } finally {
      loading.value = false;
    }
  }

  // Исправить update: один объект-аргумент
  async function update(body: UpdateWorkspaceRoleRequest) {
    loading.value = true;
    try {
      await workspaceRoleServiceFactory.updateWorkspaceRole(body).ensured("Роль успешно обновлена");
    } finally {
      loading.value = false;
    }
  }

  async function deleteWorkspaceRole(id: string) {
    loading.value = true;
    try {
      await workspaceRoleServiceFactory
        .deleteWorkspaceRole(id)
        .ensured("Роль успешно удалена");
    } finally {
      loading.value = false;
    }
  }

  async function restore(id: string) {
    loading.value = true;
    try {
      await workspaceRoleServiceFactory
        .restoreWorkspaceRole(id)
        .ensured("Роль успешно восстановлена");
    } catch (error) {
      console.error("Error restoring workspace role:", error);
    } finally {
      loading.value = false;
    }
  }

  async function reset() {
    roles.value = [];
    total.value = 0;
    currentPage.value = 1;
    pageSize.value = 25;
  }

  return {
    roles,
    total,
    currentPage,
    pageSize,
    loading,
    currentRole,
    list,
    get,
    create,
    update,
    deleteWorkspaceRole,
    restore,
    reset,
  }
});
