import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreateRoleClaimsRequest, ListRequest, RoleClaimsDto } from "~/types/request.types";

export const roleClaimServiceFactory = {
  list: (dto: ListRequest) =>
    apiContractBuilderHelper
      .get('/api/RoleClaim/list')
      .withService(IDENTITY_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<RoleClaimsDto[]>()
      .build(),

  get: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/RoleClaim/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<RoleClaimsDto>()
      .build(),

  create: (body: CreateRoleClaimsRequest) =>
    apiContractBuilderHelper
      .post('/api/RoleClaim')
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  deleteRoleClaim: (id: string) =>
    apiContractBuilderHelper
      .delete(`/api/RoleClaim/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
