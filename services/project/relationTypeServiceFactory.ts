import { PROJECT_SERVICE } from "~/constants/services.constants";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import type { RelationTypeDto } from "~/types/response.types";

export const relationTypeServiceFactory = {
    list: () =>
        apiContractBuilderHelper
            .get(`/api/RelationType`)
            .withService(PROJECT_SERVICE)
            .withResponse<RelationTypeDto[]>()
            .build(),
}