import type { PagingParams, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { CreateUserScheduleRequest, UpdateUserScheduleRequest } from "~/types/request.types";
import type { UserSchedule } from "~/types/response.types";

export const userScheduleService = {
  findByUser: (userId: string, params: PagingParams) =>
    apiContractBuilderHelper
      .get(`/api/UserSchedule/by-user/${userId}`)
      .withService(IDENTITY_SERVICE)
      .withQueryParams(params)
      .withResponse<UserSchedule[]>()
      .build(),

  getUserSchedule: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/UserSchedule/${id}`)
      .withService(IDENTITY_SERVICE)
      .withResponse<UserSchedule>()
      .build(),

  createUserSchedule: (body: CreateUserScheduleRequest) =>
    apiContractBuilderHelper
      .post("/api/UserSchedule")
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),

  updateUserSchedule: (id: string, body: UpdateUserScheduleRequest) =>
    apiContractBuilderHelper
      .patch(`/api/UserSchedule/${id}`)
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
