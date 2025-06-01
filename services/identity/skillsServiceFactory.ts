import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { PagingParams, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { CreateSkillRequest, UpdateSkillRequest } from "~/types/request.types";
import type { Skill } from "~/types/response.types";

export const skillServiceFactory = {
    list: (params: PagingParams = {}) => apiContractBuilderHelper.get('/api/Skill/list')
        .withService(IDENTITY_SERVICE)
        .withQueryParams(params)
        .withResponse<Skill[]>()
        .build(),

    get: (id: string) => apiContractBuilderHelper.get(`/api/Skill/${id}`)
        .withService(IDENTITY_SERVICE)
        .withResponse<Skill>()
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