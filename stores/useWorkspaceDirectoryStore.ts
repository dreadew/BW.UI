import { workspaceDirectoryServiceFactory } from "~/services/workspace/workspaceDirectoryServiceFactory";
import type { DeleteFileRequest } from "~/types/file.types";
import type {
  CreateWorkspaceDirectoryRequest,
  UpdateWorkspaceDirectoryRequest,
  WorkspaceDirectory,
} from "~/types/workspace/workspaceDirectory.types";

export const useWorkspaceDirectoryStore = defineStore(
  "WorkspaceDirectory",
  () => {
    const directories: Ref<WorkspaceDirectory[]> = ref([]);
    const total: Ref<number> = ref(0);
    const currentPage: Ref<number> = ref(1);
    const pageSize: Ref<number> = ref(25);
    const loading: Ref<boolean> = ref(false);

    async function list(workspaceId: string) {
      loading.value = true;
      try {
        const resp = await workspaceDirectoryServiceFactory
          .listWorkspaceDirectories({
            workspaceId,
            page: currentPage.value,
            pageSize: pageSize.value,
          })
          .execute();

        directories.value = resp;
        total.value = resp.length;
        if (resp.length == pageSize.value) {
          currentPage.value++;
        }
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
      currentPage.value = 1;
      pageSize.value = 25;
      loading.value = false;
    }

    return {
      directories,
      total,
      currentPage,
      pageSize,
      loading,
      list,
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
