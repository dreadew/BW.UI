import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { ListResponse, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreateRoleClaimsRequest, ListRequest, RoleClaimsDto } from "~/types/request.types";

export const roleClaimServiceFactory = {
  list: (roleId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/RoleClaims/list/${roleId}`)
      .withService(IDENTITY_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<ListResponse<RoleClaimsDto[]>>()
      .build(),

  get: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/RoleClaims/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<RoleClaimsDto>()
      .build(),

  create: (body: CreateRoleClaimsRequest) =>
    apiContractBuilderHelper
      .post('/api/RoleClaims')
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  deleteRoleClaim: (id: string) =>
    apiContractBuilderHelper
      .delete(`/api/RoleClaims/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
