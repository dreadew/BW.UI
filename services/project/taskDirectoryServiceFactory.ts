import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import type { CreateTaskDirectoryRequest, FileDeleteRequest, ListRequest, TaskDirectoryDto, UpdateTaskDirectoryRequest } from "~/types/request.types";

export const taskDirectoryServiceFactory = {
  create: (request: CreateTaskDirectoryRequest) =>
    apiContractBuilderHelper
      .post("/api/TaskDirectory")
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  update: (request: UpdateTaskDirectoryRequest) =>
    apiContractBuilderHelper
      .patch(`/api/TaskDirectory/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<TaskDirectoryDto>()
      .build(),

  get: (directoryId: string) =>
    apiContractBuilderHelper
      .get(`/api/TaskDirectory/${directoryId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<TaskDirectoryDto>()
      .build(),

  list: (taskId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/TasksDirectory/by-task/${taskId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<TaskDirectoryDto[]>()
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

  uploadArtifact: (directoryId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiContractBuilderHelper
      .post(`/api/TaskDirectory/${directoryId}/file`)
      .withService(PROJECT_SERVICE)
      .withBody(formData)
      .build();
  },

  deleteArtifact: (request: FileDeleteRequest) =>
    apiContractBuilderHelper
      .delete(`/api/TaskDirectory/${request.id}/file`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(request)
      .withResponse<SuccessResponse>()
      .build(),
};
