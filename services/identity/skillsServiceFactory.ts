import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreateSkillRequest, ListRequest, SkillDto, UpdateSkillRequest } from "~/types/request.types";

export const skillServiceFactory = {
    list: (dto: ListRequest) => apiContractBuilderHelper.get('/api/Skill/list')
        .withService(IDENTITY_SERVICE)
        .withQueryParams<ListRequest>(dto)
        .withResponse<SkillDto[]>()
        .build(),

    get: (id: string) => apiContractBuilderHelper.get(`/api/Skill/${id}`)
        .withService(IDENTITY_SERVICE)
        .withResponse<SkillDto>()
        .build(),

    create: (body: CreateSkillRequest) => apiContractBuilderHelper.post('/api/Skill')
        .withService(IDENTITY_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    update: (body: UpdateSkillRequest) => apiContractBuilderHelper.patch(`/api/Skill/${body.id}`)
        .withService(IDENTITY_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    delete: (id: string) => apiContractBuilderHelper.delete(`/api/Skill/${id}`)
        .withService(IDENTITY_SERVICE)
        .withResponse<SuccessResponse>()
        .build(),

    restore: (id: string) => apiContractBuilderHelper.post(`/api/Skill/${id}`)
        .withService(IDENTITY_SERVICE)
        .withResponse<SuccessResponse>()
        .build(),
};