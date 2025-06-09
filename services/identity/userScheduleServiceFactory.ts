import type { SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { CreateUserScheduleRequest, ListRequest, UpdateUserScheduleRequest, UserScheduleDto } from "~/types/request.types";

export const userScheduleService = {
  findByUser: (userId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/UserSchedule/by-user/${userId}`)
      .withService(IDENTITY_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<UserScheduleDto[]>()
      .build(),

  getUserSchedule: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/UserSchedule/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<UserScheduleDto>()
      .build(),

  createUserSchedule: (body: CreateUserScheduleRequest) =>
    apiContractBuilderHelper
      .post("/api/UserSchedule")
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  updateUserSchedule: (body: UpdateUserScheduleRequest) =>
    apiContractBuilderHelper
      .patch(`/api/UserSchedule/${body.id}`)
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  deleteUserSchedule: (id: string) =>
    apiContractBuilderHelper
      .delete(`/api/UserSchedule/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restoreUserSchedule: (id: string) =>
    apiContractBuilderHelper
      .post(`/api/UserSchedule/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
