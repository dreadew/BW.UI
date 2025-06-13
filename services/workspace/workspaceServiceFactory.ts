import type { ListResponse, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import { WORKSPACE_SERVICE } from "~/constants/services.constants";
import type { DeleteWorkspaceRequest, CreateWorkspaceRequest, DeleteWorkspaceUserRequest, FileDeleteRequest, InviteWorkspaceUserRequest, ListRequest, UpdateWorkspaceRequest, UpdateWorkspaceUserRequest, WorkspaceDto } from "~/types/request.types";

export const workspaceServiceFactory = {
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

    listWorkspaces: (dto: ListRequest) => apiContractBuilderHelper.get('/api/Workspace/list')
        .withService(WORKSPACE_SERVICE)
        .withQueryParams<ListRequest>(dto)
        .withResponse<ListResponse<WorkspaceDto[]>>()
        .build(),

    getWorkspace: (id: string) => apiContractBuilderHelper.get(`/api/Workspace/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withResponse<WorkspaceDto>()
        .build(),

    deleteWorkspace: (id: string) => apiContractBuilderHelper.delete(`/api/Workspace/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withQueryParams<DeleteWorkspaceRequest>({ id })
        .withResponse<SuccessResponse>()
        .build(),

    restoreWorkspace: (id: string) => apiContractBuilderHelper.post(`/api/Workspace/${id}`)
        .withService(WORKSPACE_SERVICE)
        .withQueryParams<DeleteWorkspaceRequest>({ id })
        .withResponse<SuccessResponse>()
        .build(),

    inviteUser: (dto: InviteWorkspaceUserRequest) => apiContractBuilderHelper.post(`/api/Workspace/${dto.id}/${dto.userId}/invite`)
        .withService(WORKSPACE_SERVICE)
        .withBody(dto)
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

    uploadPicture: (id: string, file: File) => apiContractBuilderHelper.uploadFile(`/api/Workspace/${id}/picture`)
        .withService(WORKSPACE_SERVICE)
        .withBody({ file })
        .withResponse<SuccessResponse>()
        .build(),

    deletePicture: (id: string, params: FileDeleteRequest) => apiContractBuilderHelper.delete(`/api/Workspace/${id}/picture`)
        .withService(WORKSPACE_SERVICE)
        .withQueryParams(params)
        .withResponse<SuccessResponse>()
        .build(),
}