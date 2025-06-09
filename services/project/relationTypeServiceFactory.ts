import { PROJECT_SERVICE } from "~/constants/services.constants";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { ListRequest, BaseConstantDto } from "~/types/request.types";

export const relationTypeServiceFactory = {
    list: (params: ListRequest) =>
        apiContractBuilderHelper
            .get(`/api/RelationType`)
            .withService(PROJECT_SERVICE)
            .withQueryParams<ListRequest>(params)
            .withResponse<BaseConstantDto[]>()
            .build(),
    create: (dto: BaseConstantDto) =>
        apiContractBuilderHelper
            .post(`/api/RelationType`)
            .withService(PROJECT_SERVICE)
            .withBody<BaseConstantDto>(dto)
            .build(),
    update: (dto: BaseConstantDto) =>
        apiContractBuilderHelper
            .put(`/api/RelationType/${dto.id}`)
            .withService(PROJECT_SERVICE)
            .withBody<BaseConstantDto>(dto)
            .build(),
    delete: (id: string) =>
        apiContractBuilderHelper
            .put(`/api/RelationType/${id}`)
            .withService(PROJECT_SERVICE)
            .withQueryParams<{ id: string }>({ id })
            .build(),
    restore: (id: string) =>
        apiContractBuilderHelper
            .post(`/api/RelationType/${id}`)
            .withService(PROJECT_SERVICE)
            .withQueryParams<{ id: string }>({ id })
            .build(),
}