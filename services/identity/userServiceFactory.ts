import {
  IDENTITY_SERVICE,
  type WORKSPACE_SERVICE,
} from "~/constants/services.constants";
import type {
  PagingParams,
  SingleJsonStringResponse,
  SuccessResponse,
} from "~/types/api.types";
import type {
  RecoverPasswordRequest,
  RoleRequest,
  SkillRequest,
  UpdateUserRequest,
  GenerateVerificationCodeRequest,
} from "~/types/request.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { User } from "~/types/response.types";

export const userServiceFactory = {
  listUsers: (params: PagingParams) =>
    apiContractBuilderHelper
      .get(`/api/Users/list`)
      .withService(IDENTITY_SERVICE)
      .withQueryParams(params)
      .withResponse<User[]>()
      .build(),

  getUser: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/Users/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<User>()
      .build(),

  updateUser: (id: string, body: UpdateUserRequest) =>
    apiContractBuilderHelper
      .patch(`/api/Users/${id}`)
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  deleteUser: (id: string) =>
    apiContractBuilderHelper
      .delete(`/api/Users/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restoreUser: (id: string) =>
    apiContractBuilderHelper
      .post(`/api/Users/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  uploadPhoto: (id: string, file: File) =>
    apiContractBuilderHelper
      .post(`/api/Users/${id}/photo`)
      .withService(IDENTITY_SERVICE)
      .withBody(file)
      .withResponse<SuccessResponse>()
      .build(),

  deletePhoto: (id: string) =>
    apiContractBuilderHelper
      .delete(`/api/Users/${id}/photo`)
      .withService(IDENTITY_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  addRole: (id: string, body: RoleRequest) =>
    apiContractBuilderHelper
      .post(`/api/Users/${id}/role`)
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  removeRole: (id: string, dto: RoleRequest) =>
    apiContractBuilderHelper
      .delete(`/api/Users/${id}/role`)
      .withService(IDENTITY_SERVICE)
      .withQueryParams({ roleId: dto.roleId })
      .withResponse<SuccessResponse>()
      .build(),

  addSkill: (id: string, body: SkillRequest) =>
    apiContractBuilderHelper
      .post(`/api/Users/${id}/skill`)
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  removeSkill: (id: string, body: SkillRequest) =>
    apiContractBuilderHelper
      .delete(`/api/Users/${id}/skill`)
      .withService(IDENTITY_SERVICE)
      .withQueryParams({ skillId: body.skillId })
      .withResponse<SuccessResponse>()
      .build(),

  generateVerificationCode: (body: GenerateVerificationCodeRequest) =>
    apiContractBuilderHelper
      .post(`/api/Users/generate-code`)
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  recoverPassword: (id: string, body: RecoverPasswordRequest) =>
    apiContractBuilderHelper
      .post(`/api/Users/${id}/recover-password`)
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),
};
