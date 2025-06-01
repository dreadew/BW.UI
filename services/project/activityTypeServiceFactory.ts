import { PROJECT_SERVICE } from "~/constants/services.constants";
import type { ActivityTypeDto } from "~/types/response.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";

export const activityTypeServiceFactory = {
    list: () =>
        apiContractBuilderHelper
            .get(`/api/ActivityType`)
            .withService(PROJECT_SERVICE)
            .withResponse<ActivityTypeDto[]>()
            .build(),
}