import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type {
  AddTaskAssigneeRequest,
  CreateTaskRequest,
  RemoveTaskAssigneeRequest,
  UpdateTaskRequest,
} from "~/types/request.types";
import type { PagingParams, SuccessResponse } from "~/types/api.types";
import type { TaskDto, TaskPositionDto, TaskRelationDto } from "~/types/response.types";

export const taskServiceFactory = {
  create: (request: CreateTaskRequest) =>
    apiContractBuilderHelper
      .post(`/api/Tasks`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  update: (request: UpdateTaskRequest) =>
    apiContractBuilderHelper
      .patch(`/api/Tasks/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  get: (taskId: string) =>
    apiContractBuilderHelper
      .get(`/api/Tasks/${taskId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<TaskDto>()
      .build(),

  listBySection: (sectionId: string, params: PagingParams) =>
    apiContractBuilderHelper
      .get(`/api/Tasks/by-section/${sectionId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(params)
      .withResponse<TaskDto[]>()
      .build(),

  listByProject: (projectId: string, params: PagingParams) =>
    apiContractBuilderHelper
      .get(`/api/Tasks/by-project/${projectId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(params)
      .withResponse<TaskDto[]>()
      .build(),

  delete: (taskId: string) =>
    apiContractBuilderHelper
      .delete(`/api/Tasks/${taskId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restore: (taskId: string) =>
    apiContractBuilderHelper
      .post(`/api/Tasks/${taskId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  addRelatedTask: (request: TaskRelationDto) =>
    apiContractBuilderHelper.post(`/api/Tasks/${request.id}/related-task`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  deleteRelatedTask: (request: TaskRelationDto) =>
    apiContractBuilderHelper.post(`/api/Tasks/${request.id}/related-task`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  addTaskAssignee: (request: AddTaskAssigneeRequest) =>
    apiContractBuilderHelper
      .post(`/api/Tasks/${request.taskId}/assignee`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  removeTaskAssignee: (request: RemoveTaskAssigneeRequest) =>
    apiContractBuilderHelper
      .delete(`/api/Tasks/${request.taskId}/assignee/`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  changePosition: (request: TaskPositionDto) =>
    apiContractBuilderHelper
      .post(`/api/Tasks/${request.taskId}/position`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),
};
