import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreateDirectoryRequest, DirectoryDto, FileDeleteRequest, ListRequest, UpdateDirectoryRequest } from "~/types/request.types";

export const workspaceDirectoryServiceFactory = {
  listWorkspaceDirectories: (workspaceId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/WorkspaceDirectory/${workspaceId}/list`)
      .withService(WORKSPACE_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<DirectoryDto[]>()
      .build(),

  getWorkspaceDirectory: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/WorkspaceDirectory/${id}`)
      .withService(WORKSPACE_SERVICE)
      .withResponse<DirectoryDto>()
      .build(),

  createWorkspaceDirectory: (body: CreateDirectoryRequest) =>
    apiContractBuilderHelper
      .post(`/api/WorkspaceDirectory`)
      .withService(WORKSPACE_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  updateWorkspaceDirectory: (body: UpdateDirectoryRequest) =>
    apiContractBuilderHelper
      .patch(`/api/WorkspaceDirectory/${body.id}`)
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

  deleteArtifact: (id: string, dto: FileDeleteRequest) =>
    apiContractBuilderHelper
      .delete(`/api/WorkspaceDirectory/${id}/artifact`)
      .withService(WORKSPACE_SERVICE)
      .withQueryParams<FileDeleteRequest>(dto)
      .build(),
};
