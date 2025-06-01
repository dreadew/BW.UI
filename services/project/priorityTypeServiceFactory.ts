import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { PriorityTypeDto } from "~/types/response.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";

export const priorityTypeServiceFactory = {
    list: () =>
        apiContractBuilderHelper
            .get(`/api/PriorityType`)
            .withService(PROJECT_SERVICE)
            .withResponse<PriorityTypeDto[]>()
            .build(),
}