import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { PagingParams, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type {
  CreateUserRoleClaimsRequest,
  UserRoleClaim,
} from "~/types/identity/userRoleClaim.types";

export const roleClaimServiceFactory = {
  listRoleClaims: (roleId: string) =>
    apiContractBuilderHelper
      .get(`/api/RoleClaim/list/${roleId}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<UserRoleClaim[]>()
      .build(),

  getRoleClaim: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/RoleClaim/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<UserRoleClaim>()
      .build(),

  createRoleClaim: (body: CreateUserRoleClaimsRequest) =>
    apiContractBuilderHelper
      .post("/api/RoleClaim")
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
