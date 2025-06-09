import { PROJECT_SERVICE } from "~/constants/services.constants";
import { apiContractBuilderHelper } from "../apiContractBuilder";

export const fileServiceFactory = {
    downloadStream: (path: string) =>
        apiContractBuilderHelper
            .get(`/api/File`)
            .withQueryParams({ path })
            .withService(PROJECT_SERVICE)
            .withResponse()
            .build(),
}