import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import type { AddProjectUserRequest, CreateProjectRequest, DeleteProjectRequest, DeleteProjectUserRequest, ListRequest, ProjectDto, UpdateProjectRequest } from "~/types/request.types";

export const projectServiceFactory = {
  create: (request: CreateProjectRequest) =>
    apiContractBuilderHelper
      .post("/api/Project")
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  update: (request: UpdateProjectRequest) =>
    apiContractBuilderHelper
      .patch(`/api/Project/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  get: (projectId: string) =>
    apiContractBuilderHelper
      .get(`/api/Project/${projectId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<ProjectDto>()
      .build(),

  listByWorkspace: (workspaceId: string, params: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/Project/by-workspace/${workspaceId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(params)
      .withResponse<ProjectDto[]>()
      .build(),

  listByUser: (userId: string, params: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/Project/by-user/${userId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(params)
      .withResponse<ProjectDto[]>()
      .build(),

  delete: (request: DeleteProjectRequest) =>
    apiContractBuilderHelper
      .delete(`/api/Project/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<DeleteProjectRequest>(request)
      .withResponse<SuccessResponse>()
      .build(),

  restore: (request: DeleteProjectRequest) =>
    apiContractBuilderHelper
      .post(`/api/Project/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<DeleteProjectRequest>(request)
      .withResponse<SuccessResponse>()
      .build(),

  addUser: (dto: AddProjectUserRequest) =>
    apiContractBuilderHelper
      .post(`/api/Project/${dto.id}/add-user`)
      .withService(PROJECT_SERVICE)
      .withBody<AddProjectUserRequest>(dto)
      .withResponse<SuccessResponse>()
      .build(),

  deleteUser: (dto: DeleteProjectUserRequest) =>
    apiContractBuilderHelper
      .delete(`/api/Project/${dto.id}/remove-user`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<DeleteProjectUserRequest>(dto)
      .withResponse<SuccessResponse>()
      .build(),
};
