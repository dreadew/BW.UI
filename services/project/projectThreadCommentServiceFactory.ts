import { PROJECT_SERVICE } from "~/constants/services.constants";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { SuccessResponse } from "~/types/api.types";
import type { CreateProjectThreadCommentRequest, ListRequest, ProjectThreadCommentDto, UpdateProjectThreadCommentRequest } from "~/types/request.types";

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
      .patch(`/api/ProjectThreadComments/${body.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  get: (commentId: string) =>
    apiContractBuilderHelper
      .get(`/api/ProjectThreadComments/${commentId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<ProjectThreadCommentDto>()
      .build(),

  listByThread: (threadId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/ProjectThreadComments/by-thread/${threadId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<ProjectThreadCommentDto[]>()
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
