import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { ListResponse, SuccessResponse } from "~/types/api.types";
import type { CreateProjectRoleRequest, ListRequest, ProjectRoleDto, UpdateProjectRoleRequest } from "~/types/request.types";

export const projectRoleServiceFactory = {
  create: (request: CreateProjectRoleRequest) =>
    apiContractBuilderHelper
      .post("/api/ProjectRoles")
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  update: (request: UpdateProjectRoleRequest) =>
    apiContractBuilderHelper
      .patch(`/api/ProjectRoles/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<ProjectRoleDto>()
      .build(),

  list: (projectId: string, params: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/ProjectRoles/by-project/${projectId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(params)
      .withResponse<ListResponse<ProjectRoleDto[]>>()
      .build(),

  get: (roleId: string) =>
    apiContractBuilderHelper
      .get(`/api/ProjectRoles/${roleId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<ProjectRoleDto>()
      .build(),

  delete: (roleId: string) =>
    apiContractBuilderHelper
      .delete(`/api/ProjectRoles/${roleId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restore: (roleId: string) =>
    apiContractBuilderHelper
      .post(`/api/ProjectRoles/${roleId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
