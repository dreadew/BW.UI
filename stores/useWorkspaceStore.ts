import { defineStore } from "pinia";
import { workspaceServiceFactory } from "~/services/workspace/workspaceServiceFactory";
import type {
  InviteWorkspaceUserRequest,
  UpdateWorkspaceUserRequest,
  DeleteWorkspaceUserRequest,
  UpdateWorkspaceRequest,
  CreateWorkspaceRequest,
  FileDeleteRequest,
  ListRequest,
  WorkspaceDto,
} from "~/types/request.types";

export const useWorkspaceStore = defineStore("Workspace", () => {
  const data = ref<WorkspaceDto[]>([]);
  const totalCount = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const limit = ref(20);
  const offset = ref(0);
  const includeDeleted = ref(false);

  let listAbortController: AbortController | null = null;
  let getAbortController: AbortController | null = null;

  async function list() {
    if (loading.value) return;
    if (listAbortController) listAbortController.abort();
    listAbortController = new AbortController();
    loading.value = true;
    error.value = null;
    try {
      const req: ListRequest = {
        limit: limit.value,
        offset: offset.value,
        includeDeleted: includeDeleted.value,
      };
      const resp = await workspaceServiceFactory
        .listWorkspaces(req)
        .execute(listAbortController.signal);
      data.value = resp.data;
      totalCount.value = resp.totalCount;
      return resp;
    } catch (error) {
      if ((error as any)?.name === 'AbortError') return;
      console.error("Error fetching workspaces:", error);
    } finally {
      loading.value = false;
    }
  }

  async function get(id: string) {
    loading.value = true;
    if (getAbortController) getAbortController.abort();
    getAbortController = new AbortController();
    try {
      const resp = await workspaceServiceFactory.getWorkspace(id).execute(getAbortController.signal);
      return resp;
    } catch (error) {
      if ((error as any)?.name === 'AbortError') return;
      console.error("Error fetching workspace:", error);
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, body: UpdateWorkspaceRequest) {
    loading.value = true;
    try {
      console.log(id, body)
      await workspaceServiceFactory
        .updateWorkspace(id, body)
        .ensured("Рабочее пространство успешно обновлено");
    } finally {
      loading.value = false;
    }
  }

  async function create(body: CreateWorkspaceRequest) {
    loading.value = true;
    try {
      await workspaceServiceFactory
        .createWorkspace(body)
        .ensured("Рабочее пространство успешно создано");
    } finally {
      loading.value = false;
    }
  }

  async function deleteWorkspace(id: string) {
    loading.value = true;
    try {
      await workspaceServiceFactory
        .deleteWorkspace(id)
        .ensured("Рабочее пространство успешно удалено");
    } finally {
      loading.value = false;
    }
  }

  async function restore(id: string) {
    loading.value = true;
    try {
      await workspaceServiceFactory
        .restoreWorkspace(id)
        .ensured("Рабочее пространство успешно восстановлено");
    } finally {
      loading.value = false;
    }
  }

  async function invite(dto: InviteWorkspaceUserRequest) {
    loading.value = true;
    try {
      await workspaceServiceFactory
        .inviteUser(dto)
        .ensured("Пользователь успешно приглашен в рабочее пространство");
    } finally {
      loading.value = false;
    }
  }

  async function updateUser(
    id: string,
    userId: string,
    body: UpdateWorkspaceUserRequest
  ) {
    loading.value = true;
    try {
      await workspaceServiceFactory
        .updateUser(id, userId, body)
        .ensured("Пользователь успешно обновлен в рабочем пространстве");
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser(dto: DeleteWorkspaceUserRequest) {
    loading.value = true;
    try {
      await workspaceServiceFactory
        .deleteUser(dto)
        .ensured("Пользователь успешно удален из рабочего пространства");
    } finally {
      loading.value = false;
    }
  }

  async function uploadPicture(id: string, file: File) {
    loading.value = true;
    try {
      await workspaceServiceFactory
        .uploadPicture(id, file)
        .ensured("Изображение успешно загружено");
    } finally {
      loading.value = false;
    }
  }

  async function deletePicture(id: string, params: FileDeleteRequest) {
    loading.value = true;
    try {
      await workspaceServiceFactory
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
    list()
  })

  return {
    data,
    totalCount,
    loading,
    error,
    limit,
    offset,
    includeDeleted,
    currentPage,
    list,
    get,
    update,
    create,
    deleteWorkspace,
    restore,
    invite,
    updateUser,
    deleteUser,
    uploadPicture,
    deletePicture,
    reset,
    nextPage,
    prevPage,
  }
});
