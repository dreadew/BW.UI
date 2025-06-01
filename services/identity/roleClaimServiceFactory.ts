import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { PagingParams, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreateUserRoleClaimsRequest, UpdateUserRoleClaimsRequest } from "~/types/request.types";
import type { UserRoleClaim } from "~/types/response.types";

export const roleClaimServiceFactory = {
  list: (params: PagingParams = {}) =>
    apiContractBuilderHelper
      .get('/api/RoleClaim/list')
      .withService(IDENTITY_SERVICE)
      .withQueryParams(params)
      .withResponse<UserRoleClaim[]>()
      .build(),

  get: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/RoleClaim/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<UserRoleClaim>()
      .build(),

  create: (body: CreateUserRoleClaimsRequest) =>
    apiContractBuilderHelper
      .post('/api/RoleClaim')
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  update: (body: UpdateUserRoleClaimsRequest) =>
    apiContractBuilderHelper
      .patch(`/api/RoleClaim/${body.claimType}`)
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
