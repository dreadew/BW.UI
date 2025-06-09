import { PROJECT_SERVICE } from "~/constants/services.constants";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { BaseConstantDto, ListRequest } from "~/types/request.types";

export const activityTypeServiceFactory = {
    list: (params: ListRequest) =>
        apiContractBuilderHelper
            .get(`/api/ActivityType`)
            .withService(PROJECT_SERVICE)
            .withQueryParams<ListRequest>(params)
            .withResponse<BaseConstantDto[]>()
            .build(),
    create: (dto: BaseConstantDto) =>
        apiContractBuilderHelper
            .post(`/api/ActivityType`)
            .withService(PROJECT_SERVICE)
            .withBody<BaseConstantDto>(dto)
            .build(),
    update: (dto: BaseConstantDto) =>
        apiContractBuilderHelper
            .put(`/api/ActivityType/${dto.id}`)
            .withService(PROJECT_SERVICE)
            .withBody<BaseConstantDto>(dto)
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