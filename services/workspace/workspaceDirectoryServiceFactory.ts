import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { BaseDirectoryDto, BaseDirectoryRequest, DirectoryDto, FileDeleteRequest, ListRequest } from "~/types/request.types";

export const workspaceDirectoryServiceFactory = {
  listWorkspaceDirectories: (workspaceId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/WorkspaceDirectory/${workspaceId}/list`)
      .withService(WORKSPACE_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<BaseDirectoryDto[]>()
      .build(),

  getWorkspaceDirectory: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/WorkspaceDirectory/${id}`)
      .withService(WORKSPACE_SERVICE)
      .withResponse<BaseDirectoryDto>()
      .build(),

  createWorkspaceDirectory: (body: BaseDirectoryRequest) =>
    apiContractBuilderHelper
      .post(`/api/WorkspaceDirectory`)
      .withService(WORKSPACE_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  updateWorkspaceDirectory: (body: BaseDirectoryRequest) =>
    apiContractBuilderHelper
      .patch(`/api/WorkspaceDirectory`)
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

  uploadArtifact: (id: string, file: File) => apiContractBuilderHelper
    .uploadFile(`/api/WorkspaceDirectory/${id}/artifact`)
    .withService(WORKSPACE_SERVICE)
    .withBody({ file })
    .build(),

  deleteArtifact: (id: string, dto: FileDeleteRequest) =>
    apiContractBuilderHelper
      .delete(`/api/WorkspaceDirectory/${id}/artifact`)
      .withService(WORKSPACE_SERVICE)
      .withQueryParams<FileDeleteRequest>(dto)
      .build(),
};
