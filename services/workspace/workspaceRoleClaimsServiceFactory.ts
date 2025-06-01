import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { PagingParams, SuccessResponse } from "~/types/api.types";
import type { CreateWorkspaceRoleClaimRequest, UpdateWorkspaceRoleClaimRequest } from "~/types/request.types";
import type { WorkspaceRoleClaim } from "~/types/response.types";

export const workspaceRoleClaimsServiceFactory = {
    listWorkspaceRoleClaims: (params: PagingParams) => apiContractBuilderHelper.get(`/api/WorkspaceRoleClaim/list`)
        .withService(WORKSPACE_SERVICE)
        .withQueryParams(params)
        .withResponse<WorkspaceRoleClaim[]>()
        .build(),

    getWorkspaceRoleClaim: (id: string) => apiContractBuilderHelper.get(`/api/WorkspaceRoleClaim/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<WorkspaceRoleClaim>()
        .build(),

    createWorkspaceRoleClaim: (body: CreateWorkspaceRoleClaimRequest) => apiContractBuilderHelper.post(`/api/WorkspaceRoleClaim`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    updateWorkspaceRoleClaim: (id: string, body: UpdateWorkspaceRoleClaimRequest) => apiContractBuilderHelper.patch(`/api/WorkspaceRoleClaim/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    deleteWorkspaceRoleClaim: (id: string) => apiContractBuilderHelper.delete(`/api/WorkspaceRoleClaim/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<SuccessResponse>()
        .build()
}