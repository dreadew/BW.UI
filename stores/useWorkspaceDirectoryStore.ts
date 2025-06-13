import { workspaceDirectoryServiceFactory } from "~/services/workspace/workspaceDirectoryServiceFactory";
import type { BaseDirectoryRequest, FileDeleteRequest, DirectoryDto, ListRequest, BaseDirectoryDto } from "~/types/request.types";

export const useWorkspaceDirectoryStore = defineStore(
  "WorkspaceDirectory",
  () => {
    const data: Ref<BaseDirectoryDto[]> = ref([]);
    const limit: Ref<number> = ref(20);
    const offset: Ref<number> = ref(0);
    const includeDeleted: Ref<boolean> = ref(false);
    const loading: Ref<boolean> = ref(false);
    const workspaceId: Ref<string | null> = ref(null);

    async function list() {
      loading.value = true;
      try {
        const req: ListRequest = {
          limit: limit.value,
          offset: offset.value,
          includeDeleted: includeDeleted.value
        };
        const resp = await workspaceDirectoryServiceFactory.listWorkspaceDirectories(workspaceId.value!, req).execute();
        data.value = resp;
        return resp;
      } catch (error) {
        console.error("Error fetching directories:", error);
      } finally {
        loading.value = false;
      }
    }

    async function get(id: string) {
      loading.value = true;
      try {
        const resp = await workspaceDirectoryServiceFactory
          .getWorkspaceDirectory(id)
          .execute();
        return resp;
      } finally {
        loading.value = false;
      }
    }

    async function create(body: BaseDirectoryRequest) {
      loading.value = true;
      try {
        await workspaceDirectoryServiceFactory
          .createWorkspaceDirectory(body)
          .ensured("Вы успешно создали директорию!");
        await list();
      } finally {
        loading.value = false;
      }
    }

    async function update(body: BaseDirectoryRequest) {
      loading.value = true;
      try {
        await workspaceDirectoryServiceFactory
          .updateWorkspaceDirectory(body)
          .ensured("Вы успешно обновили директорию!");
        await list();
      } finally {
        loading.value = false;
      }
    }

    async function deleteDirectory(id: string) {
      loading.value = true;
      try {
        await workspaceDirectoryServiceFactory
          .deleteWorkspaceDirectory(id)
          .ensured("Вы успешно удалили директорию!");
        await list();
      } finally {
        loading.value = false;
      }
    }

    async function restore(id: string) {
      loading.value = true;
      try {
        await workspaceDirectoryServiceFactory
          .restoreWorkspaceDirectory(id)
          .ensured("Вы успешно восстановили директорию!");
        await list();
      } finally {
        loading.value = false;
      }
    }

    async function uploadArtifact(id: string, file: File) {
      loading.value = true;
      try {
        await workspaceDirectoryServiceFactory
          .uploadArtifact(id, file)
          .ensured("Вы успешно загрузили артефакт!");
        await list();
      } finally {
        loading.value = false;
      }
    }

    async function deleteArtifact(workspaceId: string, body: FileDeleteRequest) {
      loading.value = true;
      try {
        await workspaceDirectoryServiceFactory
          .deleteArtifact(workspaceId, body)
          .ensured("Вы успешно удалили артефакт!");
        await list();
      } finally {
        loading.value = false;
      }
    }

    return {
      data,
      workspaceId,
      limit,
      offset,
      loading,
      list,
      get,
      create,
      update,
      deleteDirectory,
      restore,
      uploadArtifact,
      deleteArtifact,
    }
  }
);
