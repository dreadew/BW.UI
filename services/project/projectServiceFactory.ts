import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type {
  AddUserRequest,
  CreateProjectRequest,
  DeleteProjectRequest,
  DeleteUserRequest,
  ProjectDto,
  RestoreProjectRequest,
  UpdateProjectRequest,
} from "~/types/project/project.types";
import type { SuccessResponse } from "~/types/api.types";
import type { PagingParams } from "~/types/api.types";

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
      .patch(`/api/Project/${request.projectId}`)
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

  listByWorkspace: (workspaceId: string, params: PagingParams) =>
    apiContractBuilderHelper
      .get(`/api/Project/by-workspace/${workspaceId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(params)
      .withResponse<ProjectDto[]>()
      .build(),

  listByUser: (userId: string, params: PagingParams) =>
    apiContractBuilderHelper
      .get(`/api/Project/by-user/${userId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(params)
      .withResponse<ProjectDto[]>()
      .build(),

  delete: (request: DeleteProjectRequest) =>
    apiContractBuilderHelper
      .delete(`/api/Project/${request.projectId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(request)
      .withResponse<SuccessResponse>()
      .build(),

  restore: (request: DeleteProjectRequest) =>
    apiContractBuilderHelper
      .post(`/api/Project/${request.projectId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(request)
      .withResponse<SuccessResponse>()
      .build(),

  addUser: (request: AddUserRequest) => apiContractBuilderHelper
    .post(`/api/Project/${request.id}/add-user`)
    .withService(PROJECT_SERVICE)
    .withBody(request)
    .withResponse<SuccessResponse>()
    .build(),

  deleteUser: (request: DeleteUserRequest) => apiContractBuilderHelper
    .delete(`/api/Project/${request.id}/remove-user`)
    .withService(PROJECT_SERVICE)
    .withQueryParams(request)
    .withResponse<SuccessResponse>()
    .build(),
};
