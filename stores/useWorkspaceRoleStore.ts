import { defineStore } from "pinia";
import { workspaceRoleServiceFactory } from "~/services/workspace/workspaceRoleServiceFactory";
import type { CreateWorkspaceRoleRequest, UpdateWorkspaceRoleRequest, ListRequest, WorkspaceRoleDto } from "~/types/request.types";

export const useWorkspaceRoleStore = defineStore("WorkspaceRole", () => {
  const data = ref<WorkspaceRoleDto[]>([]);
  const workspaceId = ref<string | null>(null);
  const totalCount = ref(0);
  const offset = ref(0);
  const limit = ref(20);
  const includeDeleted = ref(false);
  const loading = ref(false);
  const currentRole = ref<WorkspaceRoleDto | null>(null);

  async function list() {
    reset();
    loading.value = true;
    try {
      if (!workspaceId.value) {
        console.error("Workspace ID is not set");
        return;
      }
      const req: ListRequest = {
        limit: limit.value,
        offset: offset.value,
        includeDeleted: includeDeleted.value
      };
      const resp = await workspaceRoleServiceFactory.listWorkspaceRoles(workspaceId.value, req).execute();
      data.value = resp.data;
      totalCount.value = resp.totalCount;
      return resp;
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
    list()
  })

  return {
    data,
    workspaceId,
    totalCount,
    currentPage,
    offset,
    limit,
    includeDeleted,
    loading,
    currentRole,
    list,
    get,
    create,
    update,
    deleteWorkspaceRole,
    restore,
    nextPage,
    prevPage,
    reset,
  }
});
