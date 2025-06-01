import {
  IDENTITY_SERVICE,
} from "~/constants/services.constants";
import type { PagingParams, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreateUserRoleRequest, UpdateUserRoleRequest } from "~/types/request.types";
import type { UserRole } from "~/types/response.types";

export const roleServiceFactory = {
  list: (params: PagingParams = {}) =>
    apiContractBuilderHelper
      .get('/api/Role/list')
      .withService(IDENTITY_SERVICE)
      .withQueryParams(params)
      .withResponse<UserRole[]>()
      .build(),

  get: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/Role/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<UserRole>()
      .build(),

  create: (body: CreateUserRoleRequest) =>
    apiContractBuilderHelper
      .post('/api/Role')
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  update: (body: UpdateUserRoleRequest) =>
    apiContractBuilderHelper
      .patch(`/api/Role/${body.id}`)
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  deleteRole: (id: string) =>
    apiContractBuilderHelper
      .delete(`/api/Role/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restore: (id: string) =>
    apiContractBuilderHelper
      .post(`/api/Role/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
