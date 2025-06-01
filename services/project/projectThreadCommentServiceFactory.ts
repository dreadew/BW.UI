import { PROJECT_SERVICE } from "~/constants/services.constants";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { PagingParams, SuccessResponse } from "~/types/api.types";
import type { CreateProjectThreadCommentRequest, UpdateProjectThreadCommentRequest } from "~/types/request.types";
import type { ProjectThreadCommentDto } from "~/types/response.types";

export const projectThreadCommentServiceFactory = {
  create: (body: CreateProjectThreadCommentRequest) =>
    apiContractBuilderHelper
      .post("/api/ProjectThreadComments")
      .withService(PROJECT_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  update: (body: UpdateProjectThreadCommentRequest) =>
    apiContractBuilderHelper
      .patch(`/api/ProjectThreadComments/${body.threadCommentId}`)
      .withService(PROJECT_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  listByThread: (threadId: string, params: PagingParams = {}) =>
    apiContractBuilderHelper
      .get(`/api/ProjectThreadComments/by-thread/${threadId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(params)
      .withResponse<ProjectThreadCommentDto[]>()
      .build(),

  get: (commentId: string) =>
    apiContractBuilderHelper
      .get(`/api/ProjectThreadComments/${commentId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<ProjectThreadCommentDto>()
      .build(),

  delete: (commentId: string) =>
    apiContractBuilderHelper
      .delete(`/api/ProjectThreadComments/${commentId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restore: (commentId: string) =>
    apiContractBuilderHelper
      .post(`/api/ProjectThreadComments/${commentId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
