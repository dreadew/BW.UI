import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type {
  CreateProjectRoleRequest,
  ProjectRoleDto,
  UpdateProjectRoleRequest,
} from "~/types/project/projectRole.types";
import type { SuccessResponse } from "~/types/api.types";

export const projectRoleServiceFactory = {
  list: (projectId: string) =>
    apiContractBuilderHelper
      .get(`/api/ProjectRoles/by-project/${projectId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<ProjectRoleDto[]>()
      .build(),

  get: (roleId: string) =>
    apiContractBuilderHelper
      .get(`/api/ProjectRoles/${roleId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<ProjectRoleDto>()
      .build(),

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
