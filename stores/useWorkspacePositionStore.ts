import { workspacePositionServiceFactory } from "~/services/workspace/workspacePositionServiceFactory";
import type {
  CreateWorkspacePositionRequest,
  UpdateWorkspacePositionRequest,
  WorkspacePosition,
} from "~/types/workspace/workspacePosition.types";

export const useWorkspacePositionStore = defineStore("WorkspacePosition", () => {
    const positions = ref<WorkspacePosition[]>([]);
    1;
    const total = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(25);
    const loading = ref(false);

    async function list(workspaceId: string) {
      reset();
      loading.value = true;
      try {
        const resp = await workspacePositionServiceFactory
          .listWorkspacePositions({
            workspaceId,
            page: currentPage.value,
            pageSize: pageSize.value,
          })
          .execute();
        positions.value = resp;
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

    async function update(id: string, body: UpdateWorkspacePositionRequest) {
      loading.value = true;
      try {
        await workspacePositionServiceFactory
          .updateWorkspacePosition(id, body)
          .ensured("Должность успешно обновлена");
      } finally {
        loading.value = false;
      }
    }

    async function create(body: CreateWorkspacePositionRequest) {
      loading.value = true;
      try {
        await workspacePositionServiceFactory
          .createWorkspacePosition(body)
          .ensured("Должность успешно создана");
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
