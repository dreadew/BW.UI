import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import type { ListResponse, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreatePositionRequest, ListRequest, PositionDto, UpdatePositionRequest } from "~/types/request.types";

export const workspacePositionServiceFactory = {
    listWorkspacePositions: (workspaceId: string, dto: ListRequest) => apiContractBuilderHelper.get(`/api/WorkspacePosition/${workspaceId}/list`)
        .withService(WORKSPACE_SERVICE)
        .withQueryParams<ListRequest>(dto)
        .withResponse<ListResponse<PositionDto[]>>()
        .build(),

    getWorkspacePosition: (id: string) => apiContractBuilderHelper.get(`/api/WorkspacePosition/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<PositionDto>()
        .build(),

    createWorkspacePosition: (body: CreatePositionRequest) => apiContractBuilderHelper.post(`/api/WorkspacePosition`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    updateWorkspacePosition: (body: UpdatePositionRequest) => apiContractBuilderHelper.patch(`/api/WorkspacePosition/${body.id}`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    deleteWorkspacePosition: (id: string) => apiContractBuilderHelper.delete(`/api/WorkspacePosition/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<SuccessResponse>()
        .build(),

    restoreWorkspacePosition: (id: string) => apiContractBuilderHelper.post(`/api/WorkspacePosition/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<SuccessResponse>()
        .build()
}