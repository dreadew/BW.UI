import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type {
  CreateTaskActivityRequest,
  TaskActivityDto,
  UpdateTaskActivityRequest,
} from "~/types/project/taskActivity.types";
import type { SuccessResponse } from "~/types/api.types";

export const taskActivityServiceFactory = {
  create: (request: CreateTaskActivityRequest) =>
    apiContractBuilderHelper
      .post("/api/TaskActivity")
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  update: (request: UpdateTaskActivityRequest) =>
    apiContractBuilderHelper
      .patch(`/api/TaskActivity/${request.taskActivityId}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  get: (taskActivityId: string) =>
    apiContractBuilderHelper
        .get(`/api/TaskActivity/${taskActivityId}`)
        .withService(PROJECT_SERVICE)
        .withResponse<TaskActivityDto>()
        .build(),

  listByUser: (userId: string) =>
    apiContractBuilderHelper
      .get(`/api/TaskActivity/by-user/${userId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<TaskActivityDto[]>()
      .build(),
    
  listByTask: (taskId: string) =>
    apiContractBuilderHelper
      .get(`/api/TaskActivity/by-task/${taskId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<TaskActivityDto[]>()
      .build(),

  delete: (activityId: string) =>
    apiContractBuilderHelper
      .delete(`/api/TaskActivity/${activityId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
