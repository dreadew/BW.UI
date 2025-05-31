import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type {
  CreateProjectRoleClaimsRequest,
  UpdateProjectRoleClaimsRequest,
} from "~/types/request.types";
import type { SuccessResponse } from "~/types/api.types";
import type { ProjectRoleClaimsDto } from "~/types/response.types";

export const projectRoleClaimsServiceFactory = {
  listByRole: (roleId: string) =>
    apiContractBuilderHelper
      .get(`/api/ProjectRoleClaims/by-role/${roleId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<ProjectRoleClaimsDto[]>()
      .build(),

  create: (request: CreateProjectRoleClaimsRequest) =>
    apiContractBuilderHelper
      .post(`/api/ProjectRoleClaims`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  update: (request: UpdateProjectRoleClaimsRequest) =>
    apiContractBuilderHelper
      .patch(`/api/ProjectRoleClaims/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  get: (claimId: string) =>
    apiContractBuilderHelper
      .get(`/api/ProjectRoleClaims/${claimId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<ProjectRoleClaimsDto>()
      .build(),

  delete: (claimId: string) =>
    apiContractBuilderHelper
      .delete(`/api/ProjectRoleClaims/${claimId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
