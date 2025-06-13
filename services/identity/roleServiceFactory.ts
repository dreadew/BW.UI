import {
  IDENTITY_SERVICE,
} from "~/constants/services.constants";
import type { ListResponse, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreateRoleRequest, ListRequest, RoleDto, UpdateRoleRequest } from "~/types/request.types";

export const roleServiceFactory = {
  list: (dto: ListRequest) =>
    apiContractBuilderHelper
      .get('/api/Role/list')
      .withService(IDENTITY_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<ListResponse<RoleDto[]>>()
      .build(),

  get: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/Role/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<RoleDto>()
      .build(),

  create: (body: CreateRoleRequest) =>
    apiContractBuilderHelper
      .post('/api/Role')
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  update: (body: UpdateRoleRequest) =>
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
