import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { ListRequest, CreateSprintRequest, UpdateSprintRequest, SprintDto } from "~/types/request.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";

export const sprintServiceFactory = {
    create: (dto: CreateSprintRequest) =>
        apiContractBuilderHelper
            .post(`/api/Sprint`)
            .withService(PROJECT_SERVICE)
            .withBody<CreateSprintRequest>(dto)
            .build(),
    update: (dto: UpdateSprintRequest) =>
        apiContractBuilderHelper
            .put(`/api/Sprint/${dto.id}`)
            .withService(PROJECT_SERVICE)
            .withBody<UpdateSprintRequest>(dto)
            .build(),
    get: (id: string) =>
        apiContractBuilderHelper
            .get(`/api/Sprint/${id}`)
            .withService(PROJECT_SERVICE)
            .withResponse<SprintDto>()
            .build(),
    list: (params: ListRequest) =>
        apiContractBuilderHelper
            .get(`/api/Sprint`)
            .withService(PROJECT_SERVICE)
            .withQueryParams<ListRequest>(params)
            .withResponse<SprintDto[]>()
            .build(),
    delete: (id: string) =>
        apiContractBuilderHelper
            .put(`/api/Sprint/${id}`)
            .withService(PROJECT_SERVICE)
            .build(),
    restore: (id: string) =>
        apiContractBuilderHelper
            .post(`/api/Sprint/${id}`)
            .withService(PROJECT_SERVICE)
            .build(),
}