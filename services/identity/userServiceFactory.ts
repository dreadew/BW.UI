import {
  IDENTITY_SERVICE,
} from "~/constants/services.constants";
import type {
  SuccessResponse,
} from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { GenerateVerificationCodeRequest, ListRequest, RecoverPasswordRequest, RoleRequest, SkillRequest, UpdateUserRequest, UserDto } from "~/types/request.types";

export const userServiceFactory = {
  listUsers: (dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/Users/list`)
      .withService(IDENTITY_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<UserDto[]>()
      .build(),

  getUser: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/Users/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<UserDto>()
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

  addRole: (body: RoleRequest) =>
    apiContractBuilderHelper
      .post(`/api/Users/${body.id}/role`)
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  removeRole: (dto: RoleRequest) =>
    apiContractBuilderHelper
      .delete(`/api/Users/${dto.id}/role`)
      .withService(IDENTITY_SERVICE)
      .withQueryParams(dto)
      .withResponse<SuccessResponse>()
      .build(),

  addSkill: (body: SkillRequest) =>
    apiContractBuilderHelper
      .post(`/api/Users/${body.id}/skill`)
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  removeSkill: (body: SkillRequest) =>
    apiContractBuilderHelper
      .delete(`/api/Users/${body.id}/skill`)
      .withService(IDENTITY_SERVICE)
      .withQueryParams(body)
      .withResponse<SuccessResponse>()
      .build(),

  generateVerificationCode: (body: GenerateVerificationCodeRequest) =>
    apiContractBuilderHelper
      .post(`/api/Users/generate-code`)
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  recoverPassword: (body: RecoverPasswordRequest) =>
    apiContractBuilderHelper
      .post(`/api/Users/${body.id}/recover-password`)
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),
};
