import { workspacePositionServiceFactory } from "~/services/workspace/workspacePositionServiceFactory";
import type { ListRequest, PositionDto, CreatePositionRequest, UpdatePositionRequest } from "~/types/request.types";
import type { WorkspacePosition } from "~/types/response.types";

export const useWorkspacePositionStore = defineStore("WorkspacePosition", () => {
  const positions = ref<WorkspacePosition[]>([]);
  1;
  const total = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(25);
  const loading = ref(false);

  // Исправить list: только req (ListRequest)
  async function list(params: ListRequest = { limit: pageSize.value, offset: 0, includeDeleted: false }) {
    reset();
    loading.value = true;
    try {
      const req: ListRequest = {
        limit: params.limit ?? pageSize.value,
        offset: params.offset ?? 0,
        includeDeleted: params.includeDeleted ?? false
      };
      const resp = await workspacePositionServiceFactory.listWorkspacePositions(req).execute();
      positions.value = resp as any; // Приведение к нужному типу, если требуется
      total.value = resp.length;
      if (resp.length == pageSize.value) {
        currentPage.value++;
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      loading.value = false;
    }
  }

  async function get(workspaceId: string) {
    loading.value = true;
    try {
      await workspacePositionServiceFactory
        .getWorkspacePosition(workspaceId)
        .execute();
    } finally {
      loading.value = false;
    }
  }

  // Исправить update/create сигнатуры: один объект-аргумент
  async function update(body: UpdatePositionRequest) {
    loading.value = true;
    try {
      await workspacePositionServiceFactory.updateWorkspacePosition(body).ensured("Должность успешно обновлена");
    } finally {
      loading.value = false;
    }
  }
  async function create(body: CreatePositionRequest) {
    loading.value = true;
    try {
      await workspacePositionServiceFactory.createWorkspacePosition(body).ensured("Должность успешно создана");
    } finally {
      loading.value = false;
    }
  }

  async function deletePosition(id: string) {
    loading.value = true;
    try {
      await workspacePositionServiceFactory
        .deleteWorkspacePosition(id)
        .ensured("Должность успешно удалена");
    } finally {
      loading.value = false;
    }
  }

  async function restore(id: string) {
    loading.value = true;
    try {
      await workspacePositionServiceFactory
        .restoreWorkspacePosition(id)
        .ensured("Должность успешно восстановлена");
    } finally {
      loading.value = false;
    }
  }

  async function reset() {
    positions.value = [];
    total.value = 0;
    currentPage.value = 1;
    pageSize.value = 25;
  }

  return {
    positions,
    total,
    currentPage,
    pageSize,
    loading,
    list,
    get,
    create,
    update,
    deletePosition,
    restore,
    reset,
  }
}
);
