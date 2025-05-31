import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { WorkspacePagingParams } from "~/types/workspace/workspace.types";
import type {
  WorkspaceDirectory,
  CreateWorkspaceDirectoryRequest,
  UpdateWorkspaceDirectoryRequest,
} from "~/types/workspace/workspaceDirectory.types";
import type { DeleteFileRequest } from "~/types/file.types";

export const workspaceDirectoryServiceFactory = {
  listWorkspaceDirectories: (params: WorkspacePagingParams) =>
    apiContractBuilderHelper
      .get(`/api/WorkspaceDirectory/list`)
      .withService(WORKSPACE_SERVICE)
      .withQueryParams(params)
      .withResponse<WorkspaceDirectory[]>()
      .build(),

  getWorkspaceDirectory: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/WorkspaceDirectory/${id}`)
      .withService(WORKSPACE_SERVICE)
      .withResponse<WorkspaceDirectory>()
      .build(),

  createWorkspaceDirectory: (body: CreateWorkspaceDirectoryRequest) =>
    apiContractBuilderHelper
      .post(`/api/WorkspaceDirectory`)
      .withService(WORKSPACE_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  updateWorkspaceDirectory: (
    id: string,
    body: UpdateWorkspaceDirectoryRequest
  ) =>
    apiContractBuilderHelper
      .patch(`/api/WorkspaceDirectory/${id}`)
      .withService(WORKSPACE_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  deleteWorkspaceDirectory: (id: string) =>
    apiContractBuilderHelper
      .delete(`/api/WorkspaceDirectory/${id}`)
      .withService(WORKSPACE_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restoreWorkspaceDirectory: (id: string) =>
    apiContractBuilderHelper
      .post(`/api/WorkspaceDirectory/${id}`)
      .withService(WORKSPACE_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  uploadArtifact: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiContractBuilderHelper
      .post(`/api/WorkspaceDirectory/${id}/artifact`)
      .withService(WORKSPACE_SERVICE)
      .withBody(formData)
      .build();
  },

  deleteArtifact: (id: string, params: DeleteFileRequest) =>
    apiContractBuilderHelper
      .delete(`/api/WorkspaceDirectory/${id}/artifact`)
      .withService(WORKSPACE_SERVICE)
      .withQueryParams(params)
      .build(),
};
