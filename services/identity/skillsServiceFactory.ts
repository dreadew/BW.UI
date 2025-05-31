import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import type { Skill, CreateSkillRequest, UpdateSkillRequest } from "~/types/identity/skill.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";

export const skillServiceFactory = {
    list: () => apiContractBuilderHelper.get('/api/Skills/list')
        .withService(IDENTITY_SERVICE)
        .withResponse<Skill[]>()
        .build(),

    get: (id: string) => apiContractBuilderHelper.get(`/api/Skills/${id}`)
        .withService(IDENTITY_SERVICE)
        .withResponse<Skill>()
        .build(),

    create: (body: CreateSkillRequest) => apiContractBuilderHelper.post('/api/Skill')
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
        .build()
}