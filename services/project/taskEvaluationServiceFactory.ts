import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { PagingParams, SuccessResponse } from "~/types/api.types";
import type { CreateTaskEvaluationRequest, UpdateTaskEvaluationRequest } from "~/types/request.types";
import type { TaskEvaluationDto } from "~/types/response.types";

export const taskEvaluationServiceFactory = {
  create: (request: CreateTaskEvaluationRequest) =>
    apiContractBuilderHelper
      .post("/api/TaskEvaluation")
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  update: (request: UpdateTaskEvaluationRequest) =>
    apiContractBuilderHelper
      .patch(`/api/TaskEvaluation/${request.evaluationId}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  get: (taskEvaluationId: string) =>
    apiContractBuilderHelper
      .get(`/api/TaskEvaluation/${taskEvaluationId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<TaskEvaluationDto>()
      .build(),

  list: (taskId: string, params: PagingParams) =>
    apiContractBuilderHelper
      .get(`/api/TaskEvaluation/by-task/${taskId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(params)
      .withResponse<TaskEvaluationDto[]>()
      .build(),

  delete: (evaluationId: string) =>
    apiContractBuilderHelper
      .delete(`/api/TaskEvaluation/${evaluationId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restore: (evaluationId: string) =>
    apiContractBuilderHelper
      .post(`/api/TaskEvaluation/${evaluationId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
