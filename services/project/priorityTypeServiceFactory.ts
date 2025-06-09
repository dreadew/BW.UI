import { PROJECT_SERVICE } from "~/constants/services.constants";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { BaseConstantDto, ListRequest } from "~/types/request.types";

export const priorityTypeServiceFactory = {
    list: (params: ListRequest) =>
        apiContractBuilderHelper
            .get(`/api/PriorityType`)
            .withService(PROJECT_SERVICE)
            .withQueryParams<ListRequest>(params)
            .withResponse<BaseConstantDto[]>()
            .build(),
    create: (dto: BaseConstantDto) =>
        apiContractBuilderHelper
            .post(`/api/PriorityType`)
            .withService(PROJECT_SERVICE)
            .withBody<BaseConstantDto>(dto)
            .build(),
    update: (dto: BaseConstantDto) =>
        apiContractBuilderHelper
            .put(`/api/PriorityType/${dto.id}`)
            .withService(PROJECT_SERVICE)
            .withBody<BaseConstantDto>(dto)
            .build(),
    delete: (id: string) =>
        apiContractBuilderHelper
            .put(`/api/PriorityType/${id}`)
            .withService(PROJECT_SERVICE)
            .withQueryParams<{ id: string }>({ id })
            .build(),
    restore: (id: string) =>
        apiContractBuilderHelper
            .post(`/api/PriorityType/${id}`)
            .withService(PROJECT_SERVICE)
            .withQueryParams<{ id: string }>({ id })
            .build(),
}