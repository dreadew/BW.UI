import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import type { ListResponse, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreateWorkspaceRoleRequest, ListRequest, UpdateWorkspaceRoleRequest, WorkspaceRoleDto } from "~/types/request.types";

export const workspaceRoleServiceFactory = {
    listWorkspaceRoles: (workspaceId: string, dto: ListRequest) => apiContractBuilderHelper.get(`/api/WorkspaceRole/${workspaceId}/list`)
        .withService(WORKSPACE_SERVICE)
        .withQueryParams<ListRequest>(dto)
        .withResponse<ListResponse<WorkspaceRoleDto[]>>()
        .build(),

    getWorkspaceRole: (id: string) => apiContractBuilderHelper.get(`/api/WorkspaceRole/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<WorkspaceRoleDto>()
        .build(),

    createWorkspaceRole: (body: CreateWorkspaceRoleRequest) => apiContractBuilderHelper.post(`/api/WorkspaceRole`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    updateWorkspaceRole: (body: UpdateWorkspaceRoleRequest) => apiContractBuilderHelper.patch(`/api/WorkspaceRole/${body.id}`)
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