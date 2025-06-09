import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import type { CreateSectionRequest, ListRequest, SectionDto, UpdateSectionRequest } from "~/types/request.types";

export const sectionServiceFactory = {
  create: (request: CreateSectionRequest) =>
    apiContractBuilderHelper
      .post("/api/Sections")
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  update: (request: UpdateSectionRequest) =>
    apiContractBuilderHelper
      .patch(`/api/Sections/${request.id}`)
      .withService(PROJECT_SERVICE)
      .withBody(request)
      .withResponse<SuccessResponse>()
      .build(),

  get: (id: string) =>
    apiContractBuilderHelper
      .get(`/api/Sections/${id}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SectionDto>()
      .build(),

  listByProject: (projectId: string, dto: ListRequest) =>
    apiContractBuilderHelper
      .get(`/api/Section/by-project/${projectId}`)
      .withService(PROJECT_SERVICE)
      .withQueryParams<ListRequest>(dto)
      .withResponse<SectionDto[]>()
      .build(),

  deleteSection: (id: string) =>
    apiContractBuilderHelper
      .delete(`/api/Sections/${id}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),

  restore: (id: string) =>
    apiContractBuilderHelper
      .post(`/api/Sections/${id}`)
      .withService(PROJECT_SERVICE)
      .withResponse<SuccessResponse>()
      .build(),
};
