import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreateWorkspaceRoleRequest, UpdateWorkspaceRoleRequest } from "~/types/request.types";
import type { WorkspacePagingParams, WorkspaceRole } from "~/types/response.types";

export const workspaceRoleServiceFactory = {
    listWorkspaceRoles: (params: WorkspacePagingParams) => apiContractBuilderHelper.get(`/api/WorkspaceRole/list`)
        .withService(WORKSPACE_SERVICE)
        .withQueryParams(params)
        .withResponse<WorkspaceRole[]>()
        .build(),

    getWorkspaceRole: (id: string) => apiContractBuilderHelper.get(`/api/WorkspaceRole/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<WorkspaceRole>()
        .build(),

    createWorkspaceRole: (body: CreateWorkspaceRoleRequest) => apiContractBuilderHelper.post(`/api/WorkspaceRole`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    updateWorkspaceRole: (id: string, body: UpdateWorkspaceRoleRequest) => apiContractBuilderHelper.patch(`/api/WorkspaceRole/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    deleteWorkspaceRole: (id: string) => apiContractBuilderHelper.delete(`/api/WorkspaceRole/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<SuccessResponse>()
        .build(),

    restoreWorkspaceRole: (id: string) => apiContractBuilderHelper.post(`/api/WorkspaceRole/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<SuccessResponse>()
        .build()
}