import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import type { CreateProjectRoleClaimsRequest, ListRequest, ProjectRoleClaimsDto, UpdateProjectRoleClaimsRequest } from "~/types/request.types";

export const projectRoleClaimsServiceFactory = {
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

  listByRole: (roleId: string, params: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/ProjectRoleClaims/by-role/${roleId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(params)
      .withResponse<ProjectRoleClaimsDto[]>()
      .build(),

  delete: (claimId: string) =>
    apiContractBuilderHelper
      .delete(`/api/ProjectRoleClaims/${claimId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
