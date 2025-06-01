import type { PagingParams, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import type { CreateWorkspaceRequest, UpdateWorkspaceRequest, InviteWorkspaceUserRequest, UpdateWorkspaceUserRequest, DeleteWorkspaceUserRequest, DeleteFileRequest } from "~/types/request.types";
import type { Workspace } from "~/types/response.types";

export const workspaceServiceFactory = {
    listWorkspaces: (params: PagingParams) => apiContractBuilderHelper.get('/api/Workspace/list')
        .withService(WORKSPACE_SERVICE)
        .withQueryParams(params)
        .withResponse<Workspace[]>()
        .build(),

    getWorkspace: (id: string) => apiContractBuilderHelper.get(`/api/Workspace/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<Workspace>()
        .build(),

    createWorkspace: (body: CreateWorkspaceRequest) => apiContractBuilderHelper.post('/api/Workspace')
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    updateWorkspace: (id: string, body: UpdateWorkspaceRequest) => apiContractBuilderHelper.patch(`/api/Workspace/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    deleteWorkspace: (id: string) => apiContractBuilderHelper.delete(`/api/Workspace/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<SuccessResponse>()
        .build(),

    restoreWorkspace: (id: string) => apiContractBuilderHelper.post(`/api/Workspace/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<SuccessResponse>()
        .build(),

    inviteUser: (dto: InviteWorkspaceUserRequest) => apiContractBuilderHelper.post(`/api/Workspace/${dto.id}/${dto.userId}/invite`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<SuccessResponse>()
        .build(),

    updateUser: (id: string, userId: string, body: UpdateWorkspaceUserRequest) => apiContractBuilderHelper.patch(`/api/Workspace/${id}/${userId}`)
        .withService(WORKSPACE_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    deleteUser: (dto: DeleteWorkspaceUserRequest) => apiContractBuilderHelper.delete(`/api/Workspace/${dto.id}/${dto.userId}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<SuccessResponse>()
        .build(),

    uploadPicture: (id: string, file: File) => apiContractBuilderHelper.post(`/api/Workspace/${id}/picture`)
        .withService(WORKSPACE_SERVICE)
        .withBody(file)
        .withResponse<SuccessResponse>()
        .build(),

    deletePicture: (id: string, params: DeleteFileRequest) => apiContractBuilderHelper.delete(`/api/Workspace/${id}/picture`)
        .withService(WORKSPACE_SERVICE)
        .withQueryParams(params)
        .withResponse<SuccessResponse>()
        .build(),
}