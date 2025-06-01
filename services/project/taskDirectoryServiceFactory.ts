import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type {
  CreateTaskDirectoryRequest,
  DeleteFileRequest,
  UpdateTaskDirectoryRequest,
} from "~/types/request.types";
import type { SuccessResponse, PagingParams } from "~/types/api.types";
import type { TaskDirectoryDto } from "~/types/response.types";

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

  list: (taskId: string, params: PagingParams = {}) =>
    apiContractBuilderHelper
      .get(`/api/TasksDirectory/by-task/${taskId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(params)
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

  deleteArtifact: (request: DeleteFileRequest) =>
    apiContractBuilderHelper
      .delete(`/api/TaskDirectory/${request.id}/file`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(request)
      .withResponse<SuccessResponse>()
      .build(),
};
