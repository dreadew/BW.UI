import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { PagingParams, SuccessResponse } from "~/types/api.types";
import type { CreateTaskTodoListRequest, UpdateTaskTodoListRequest, CreateTaskTodoListItemRequest, UpdateTaskTodoListItemRequest } from "~/types/request.types";
import type { TaskTodoListDto, TaskTodoListItemDto } from "~/types/response.types";

export const taskTodoListServiceFactory = {
  list: (taskId: string, params: PagingParams) =>
    apiContractBuilderHelper
      .get(`/api/TaskTodoList/by-task/${taskId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams(params)
      .withResponse<TaskTodoListDto[]>()
      .build(),

  get: (todoListId: string) =>
    apiContractBuilderHelper.get(`/api/TaskTodoList/${todoListId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<TaskTodoListDto>()
      .build(),

  createTodoList: (request: CreateTaskTodoListRequest) =>
    apiContractBuilderHelper
      .post("/api/TaskTodoList")
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  updateTodoList: (request: UpdateTaskTodoListRequest) =>
    apiContractBuilderHelper
      .patch(`/api/TaskTodoList/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  deleteTaskTodoList: (todoListId: string) =>
    apiContractBuilderHelper
      .delete(`/api/TaskTodoList/${todoListId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restoreTaskTodoList: (todoListId: string) =>
    apiContractBuilderHelper
      .post(`/api/TaskTodoList/${todoListId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  createTaskTodoListItem: (request: CreateTaskTodoListItemRequest) =>
    apiContractBuilderHelper
      .post("/api/TaskTodoList/item")
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  updateTaskTodoListItem: (request: UpdateTaskTodoListItemRequest) =>
    apiContractBuilderHelper
      .patch(`/api/TaskTodoList/item/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  getTaskTodoListItem: (itemId: string) =>
    apiContractBuilderHelper
      .get(`/api/TaskTodoList/item/${itemId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<TaskTodoListItemDto>()
      .build(),

  deleteTaskTodoListItem: (itemId: string) =>
    apiContractBuilderHelper
      .delete(`/api/TaskTodoListItem/item/${itemId}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
