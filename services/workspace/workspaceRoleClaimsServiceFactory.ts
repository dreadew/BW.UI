import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { ListResponse, SuccessResponse } from "~/types/api.types";
import type { CreateWorkspaceRoleClaimsRequest, ListRequest, UpdateWorkspaceRoleClaimsRequest, WorkspaceRoleClaimsDto } from "~/types/request.types";

export const workspaceRoleClaimsServiceFactory = {
    listWorkspaceRoleClaims: (id: string, dto: ListRequest) => apiContractBuilderHelper.get(`/api/WorkspaceRoleClaims/${id}/list`)
        .withService(WORKSPACE_SERVICE)
        .withQueryParams<ListRequest>(dto)
        .withResponse<ListResponse<WorkspaceRoleClaimsDto[]>>()
        .build(),

    getWorkspaceRoleClaim: (id: string) => apiContractBuilderHelper.get(`/api/WorkspaceRoleClaims/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<WorkspaceRoleClaimsDto>()
        .build(),

    createWorkspaceRoleClaim: (body: CreateWorkspaceRoleClaimsRequest) => apiContractBuilderHelper.post(`/api/WorkspaceRoleClaims`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    updateWorkspaceRoleClaim: (id: string, body: UpdateWorkspaceRoleClaimsRequest) => apiContractBuilderHelper.patch(`/api/WorkspaceRoleClaims/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    deleteWorkspaceRoleClaim: (id: string) => apiContractBuilderHelper.delete(`/api/WorkspaceRoleClaims/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<SuccessResponse>()
        .build()
}