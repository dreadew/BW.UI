import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { ListResponse, SuccessResponse } from "~/types/api.types";
import type { CreateProjectThreadRequest, ListRequest, ProjectThreadDto, UpdateProjectThreadRequest } from "~/types/request.types";

export const projectThreadServiceFactory = {
  create: (body: CreateProjectThreadRequest) =>
    apiContractBuilderHelper
      .post("/api/ProjectThreads")
      .withService(PROJECT_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  update: (body: UpdateProjectThreadRequest) =>
    apiContractBuilderHelper
      .patch(`/api/ProjectThreads/${body.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  listByProject: (projectId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/ProjectThreads/by-project/${projectId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<ListResponse<ProjectThreadDto[]>>()
      .build(),

  get: (threadId: string) =>
    apiContractBuilderHelper
      .get(`/api/ProjectThreads/${threadId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<ProjectThreadDto>()
      .build(),

  deleteThread: (threadId: string) =>
    apiContractBuilderHelper
      .delete(`/api/ProjectThreads/${threadId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restore: (threadId: string) =>
    apiContractBuilderHelper
      .post(`/api/ProjectThreads/${threadId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
