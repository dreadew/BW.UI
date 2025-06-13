import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { ListResponse, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreateSkillRequest, ListRequest, SkillDto, UpdateSkillRequest } from "~/types/request.types";

export const skillServiceFactory = {
    list: (dto: ListRequest) => apiContractBuilderHelper.get('/api/Skills/list')
        .withService(IDENTITY_SERVICE)
        .withQueryParams<ListRequest>(dto)
        .withResponse<ListResponse<SkillDto[]>>()
        .build(),

    get: (id: string) => apiContractBuilderHelper.get(`/api/Skills/${id}`)
        .withService(IDENTITY_SERVICE)
        .withResponse<SkillDto>()
        .build(),

    create: (body: CreateSkillRequest) => apiContractBuilderHelper.post('/api/Skills')
        .withService(IDENTITY_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    update: (body: UpdateSkillRequest) => apiContractBuilderHelper.patch(`/api/Skills/${body.id}`)
        .withService(IDENTITY_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    delete: (id: string) => apiContractBuilderHelper.delete(`/api/Skills/${id}`)
        .withService(IDENTITY_SERVICE)
        .withResponse<SuccessResponse>()
        .build(),

    restore: (id: string) => apiContractBuilderHelper.post(`/api/Skills/${id}`)
        .withService(IDENTITY_SERVICE)
        .withResponse<SuccessResponse>()
        .build(),
};