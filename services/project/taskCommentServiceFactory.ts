import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import type { CreateTaskCommentRequest, ListRequest, TaskCommentDto, UpdateTaskCommentRequest } from "~/types/request.types";

export const taskCommentServiceFactory = {
  create: (request: CreateTaskCommentRequest) =>
    apiContractBuilderHelper
      .post(`/api/TaskComment`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  update: (request: UpdateTaskCommentRequest) =>
    apiContractBuilderHelper
      .patch(`/api/TaskComment/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  get: (commentId: string) =>
    apiContractBuilderHelper
      .get(`/api/TaskComment/${commentId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<TaskCommentDto>()
      .build(),

  listByTask: (taskId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/TaskComment/by-task/${taskId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<TaskCommentDto[]>()
      .build(),

  delete: (commentId: string) =>
    apiContractBuilderHelper
      .delete(`/api/TaskComment/${commentId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restore: (commentId: string) =>
    apiContractBuilderHelper
      .post(`/api/TaskComment/${commentId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
