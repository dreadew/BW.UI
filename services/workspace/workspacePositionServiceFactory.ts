import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { WorkspacePagingParams } from "~/types/workspace/workspace.types";
import type { WorkspacePosition, CreateWorkspacePositionRequest, UpdateWorkspacePositionRequest } from "~/types/workspace/workspacePosition.types";

export const workspacePositionServiceFactory = {
    listWorkspacePositions: (params: WorkspacePagingParams) => apiContractBuilderHelper.get(`/api/WorkspacePosition/list`)
        .withService(WORKSPACE_SERVICE)
        .withQueryParams(params)
        .withResponse<WorkspacePosition[]>()
        .build(),

    getWorkspacePosition: (id: string) => apiContractBuilderHelper.get(`/api/WorkspacePosition/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<WorkspacePosition>()
        .build(),

    createWorkspacePosition: (body: CreateWorkspacePositionRequest) => apiContractBuilderHelper.post(`/api/WorkspacePosition`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),
    
    updateWorkspacePosition: (id: string, body: UpdateWorkspacePositionRequest) => apiContractBuilderHelper.patch(`/api/WorkspacePosition/${id}`)
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