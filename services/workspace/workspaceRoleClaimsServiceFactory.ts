import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { SuccessResponse } from "~/types/api.types";
import type { CreateWorkspaceRoleClaimsRequest, ListRequest, UpdateWorkspaceRoleClaimsRequest, WorkspaceRoleClaimsDto } from "~/types/request.types";

export const workspaceRoleClaimsServiceFactory = {
    listWorkspaceRoleClaims: (dto: ListRequest) => apiContractBuilderHelper.get(`/api/WorkspaceRoleClaim/list`)
        .withService(WORKSPACE_SERVICE)
        .withQueryParams<ListRequest>(dto)
        .withResponse<WorkspaceRoleClaimsDto[]>()
        .build(),

    getWorkspaceRoleClaim: (id: string) => apiContractBuilderHelper.get(`/api/WorkspaceRoleClaim/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<WorkspaceRoleClaimsDto>()
        .build(),

    createWorkspaceRoleClaim: (body: CreateWorkspaceRoleClaimsRequest) => apiContractBuilderHelper.post(`/api/WorkspaceRoleClaim`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    updateWorkspaceRoleClaim: (id: string, body: UpdateWorkspaceRoleClaimsRequest) => apiContractBuilderHelper.patch(`/api/WorkspaceRoleClaim/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    deleteWorkspaceRoleClaim: (id: string) => apiContractBuilderHelper.delete(`/api/WorkspaceRoleClaim/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<SuccessResponse>()
        .build()
}