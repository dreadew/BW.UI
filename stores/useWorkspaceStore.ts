import { defineStore } from "pinia";
import { workspaceServiceFactory } from "~/services/workspace/workspaceServiceFactory";
import type {
  InviteWorkspaceUserRequest,
  UpdateWorkspaceUserRequest,
  DeleteWorkspaceUserRequest,
  UpdateWorkspaceRequest,
  CreateWorkspaceRequest,
  DeleteFileRequest,
} from "~/types/request.types";
import type { Workspace } from "~/types/response.types";

export const useWorkspaceStore = defineStore("Workspace", () => {
  const workspaces = ref<Workspace[]>([]);
  const total = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(25);
  const loading = ref(false);

  async function list() {
    if (loading.value) return;

    loading.value = true;
    try {
      const resp = await workspaceServiceFactory
        .listWorkspaces({
          page: currentPage.value,
          pageSize: pageSize.value,
        })
        .execute();

      if (resp.length > 0) {
        workspaces.value = [...workspaces.value, ...resp];
        currentPage.value++;
      }

      total.value = resp.length;
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    } finally {
      loading.value = false;
    }
  }

  async function get(id: string) {
    loading.value = true;
    try {
      const resp = await workspaceServiceFactory.getWorkspace(id).execute();
      return resp;
    } catch (error) {
      console.error("Error fetching workspace:", error);
    } finally {
      loading.value = false;
    }
  }

  async function update(id: string, body: UpdateWorkspaceRequest) {
    loading.value = true;
    try {
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

  async function deletePicture(id: string, params: DeleteFileRequest) {
    loading.value = true;
    try {
      await workspaceServiceFactory
        .deletePicture(id, params)
        .ensured("Изображение успешно удалено");
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    workspaces.value = [];
    currentPage.value = 1;
  }

  return {
    workspaces,
    total,
    currentPage,
    pageSize,
    loading,
    list,
    get,
    update,
    create,
    deleteWorkspace,
    invite,
    updateUser,
    deleteUser,
    uploadPicture,
    deletePicture,
    reset,
  }
});
