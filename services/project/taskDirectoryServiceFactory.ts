import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import type { BaseDirectoryDto, BaseDirectoryRequest, FileDeleteRequest, ListRequest } from "~/types/request.types";

export const taskDirectoryServiceFactory = {
  create: (request: BaseDirectoryRequest) =>
    apiContractBuilderHelper
      .post("/api/TaskDirectory")
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<BaseDirectoryDto>()
      .build(),

  update: (request: BaseDirectoryRequest) =>
    apiContractBuilderHelper
      .patch(`/api/TaskDirectory/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<BaseDirectoryDto>()
      .build(),

  get: (directoryId: string) =>
    apiContractBuilderHelper
      .get(`/api/TaskDirectory/${directoryId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<BaseDirectoryDto>()
      .build(),

  list: (taskId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/TaskDirectory/by-task/${taskId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<BaseDirectoryDto[]>()
      .build(),

  deleteTaskDirectory: (directoryId: string) =>
    apiContractBuilderHelper
      .delete(`/api/TaskDirectory/${directoryId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restore: (directoryId: string) =>
    apiContractBuilderHelper
      .post(`/api/TaskDirectory/${directoryId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  uploadArtifact: (directoryId: string, file: File) => apiContractBuilderHelper
    .uploadFile(`/api/TaskDirectory/${directoryId}/file`)
    .withService(PROJECT_SERVICE)
    .withBody({ file })
    .build(),

  deleteArtifact: (request: FileDeleteRequest) =>
    apiContractBuilderHelper
      .delete(`/api/TaskDirectory/${request.id}/file`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(request)
      .withResponse<SuccessResponse>()
      .build(),
};
