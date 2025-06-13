import { workspacePositionServiceFactory } from "~/services/workspace/workspacePositionServiceFactory";
import type { ListRequest, PositionDto, CreatePositionRequest, UpdatePositionRequest } from "~/types/request.types";

export const useWorkspacePositionStore = defineStore("WorkspacePosition", () => {
  const data = ref<PositionDto[]>([]);
  const workspaceId = ref<string | null>(null);
  const totalCount = ref(0);
  const offset = ref(0);
  const limit = ref(25);
  const includeDeleted = ref(false);
  const loading = ref(false);

  async function list() {
    reset();
    loading.value = true;
    try {
      if (!workspaceId.value) {
        console.error("Workspace ID is not set");
        return [];
      }
      const req: ListRequest = {
        limit: limit.value,
        offset: offset.value,
        includeDeleted: includeDeleted.value
      };
      const resp = await workspacePositionServiceFactory.listWorkspacePositions(workspaceId.value, req).execute();
      data.value = resp.data;
      totalCount.value = resp.totalCount;
      return data.value;
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
    limit,
    offset,
    includeDeleted,
    loading,
    list,
    get,
    create,
    update,
    deletePosition,
    restore,
    reset,
    prevPage,
    nextPage
  }
}
);
