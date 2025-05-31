import type { CreateSectionRequest, SectionDto, UpdateSectionRequest } from "~/types/project/section.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";

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
      .patch(`/api/Sections/${request.sectionId}`)
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
  
  listByProject: (projectId: string) =>
    apiContractBuilderHelper
      .get(`/api/Sections/${projectId}`)
      .withService(PROJECT_SERVICE)
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
