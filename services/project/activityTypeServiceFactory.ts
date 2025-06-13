import { PROJECT_SERVICE } from "~/constants/services.constants";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { BaseConstantDto, BaseSoftDeletableDto, BaseSoftDeletableDtoWithName, ListRequest } from "~/types/request.types";

export const activityTypeServiceFactory = {
    list: (params: ListRequest) =>
        apiContractBuilderHelper
            .get(`/api/ActivityType`)
            .withService(PROJECT_SERVICE)
            .withQueryParams<ListRequest>(params)
            .withResponse<BaseSoftDeletableDtoWithName[]>()
            .build(),
    create: (dto: BaseSoftDeletableDtoWithName) =>
        apiContractBuilderHelper
            .post(`/api/ActivityType`)
            .withService(PROJECT_SERVICE)
            .withBody<BaseSoftDeletableDtoWithName>(dto)
            .build(),
    update: (dto: BaseSoftDeletableDtoWithName) =>
        apiContractBuilderHelper
            .put(`/api/ActivityType/${dto.id}`)
            .withService(PROJECT_SERVICE)
            .withBody<BaseSoftDeletableDtoWithName>(dto)
            .build(),
    delete: (id: string) =>
        apiContractBuilderHelper
            .put(`/api/ActivityType/${id}`)
            .withService(PROJECT_SERVICE)
            .withQueryParams<{ id: string }>({ id })
            .build(),
    restore: (id: string) =>
        apiContractBuilderHelper
            .post(`/api/ActivityType/${id}`)
            .withService(PROJECT_SERVICE)
            .withQueryParams<{ id: string }>({ id })
            .build(),
}