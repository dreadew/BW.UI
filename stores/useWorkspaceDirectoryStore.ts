import { workspaceDirectoryServiceFactory } from "~/services/workspace/workspaceDirectoryServiceFactory";
import type {
  CreateWorkspaceDirectoryRequest,
  DeleteFileRequest,
  UpdateWorkspaceDirectoryRequest,
} from "~/types/request.types";
import type { WorkspaceDirectory } from "~/types/response.types";

export const useWorkspaceDirectoryStore = defineStore(
  "WorkspaceDirectory",
  () => {
    const directories: Ref<WorkspaceDirectory[]> = ref([]);
    const total: Ref<number> = ref(0);
    const limit: Ref<number> = ref(20);
    const offset: Ref<number> = ref(0);
    const loading: Ref<boolean> = ref(false);

    async function list(workspaceId: string, params: { limit?: number; offset?: number } = {}) {
      loading.value = true;
      try {
        const resp = await workspaceDirectoryServiceFactory
          .listWorkspaceDirectories({
            workspaceId,
            limit: params.limit ?? limit.value,
            offset: params.offset ?? offset.value,
          })
          .execute();

        directories.value = resp;
        total.value = resp.length;
      } catch (error) {
        console.error("Error fetching directories:", error);
      } finally {
        loading.value = false;
      }
    }

    function setPaging(newLimit: number, newOffset: number) {
      limit.value = newLimit;
      offset.value = newOffset;
    }

    function nextPage() {
      offset.value += limit.value;
    }

    function prevPage() {
      offset.value = Math.max(0, offset.value - limit.value);
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

    async function create(body: CreateWorkspaceDirectoryRequest) {
      loading.value = true;
      try {
        await workspaceDirectoryServiceFactory
          .createWorkspaceDirectory(body)
          .ensured("Вы успешно создали директорию!");
      } finally {
        loading.value = false;
      }
    }

    async function update(id: string, body: UpdateWorkspaceDirectoryRequest) {
      loading.value = true;
      try {
        await workspaceDirectoryServiceFactory
          .updateWorkspaceDirectory(id, body)
          .ensured("Вы успешно обновили директорию!");
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
      } finally {
        loading.value = false;
      }
    }

    async function deleteArtifact(id: string, params: DeleteFileRequest) {
      loading.value = true;
      try {
        await workspaceDirectoryServiceFactory
          .deleteArtifact(id, params)
          .ensured("Вы успешно удалили артефакт!");
      } finally {
        loading.value = false;
      }
    }

    async function reset() {
      directories.value = [];
      total.value = 0;
      offset.value = 0;
      limit.value = 20;
      loading.value = false;
    }

    return {
      directories,
      total,
      limit,
      offset,
      loading,
      list,
      setPaging,
      nextPage,
      prevPage,
      get,
      create,
      update,
      deleteDirectory,
      restore,
      uploadArtifact,
      deleteArtifact,
      reset,
    }
  }
);
