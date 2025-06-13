import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { ListResponse, SuccessResponse } from "~/types/api.types";
import type { AddTaskAssigneeRequest, AddTaskSprintRequest, CreateTaskRequest, ListRequest, RemoveTaskAssigneeRequest, RemoveTaskSprintRequest, TaskDto, TaskPositionDto, TaskRelationDto, UpdateTaskRequest } from "~/types/request.types";

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

  listBySection: (sectionId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/Tasks/by-section/${sectionId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<ListResponse<TaskDto[]>>()
      .build(),

  listByProject: (projectId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/Tasks/by-project/${projectId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<ListResponse<TaskDto[]>>()
      .build(),

  listByUser: (userId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/Tasks/by-user/${userId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<ListResponse<TaskDto[]>>()
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
      .post(`/api/Tasks/${request.id}/assignee`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  removeTaskAssignee: (request: RemoveTaskAssigneeRequest) =>
    apiContractBuilderHelper
      .delete(`/api/Tasks/${request.id}/assignee`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  addTaskSprint: (request: AddTaskSprintRequest) =>
    apiContractBuilderHelper
      .post(`/api/Tasks/${request.id}/sprint`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  removeTaskSprint: (request: RemoveTaskSprintRequest) =>
    apiContractBuilderHelper
      .delete(`/api/Tasks/${request.id}/assignee`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  changePosition: (request: TaskPositionDto) =>
    apiContractBuilderHelper
      .post(`/api/Tasks/${request.id}/position`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),
};
