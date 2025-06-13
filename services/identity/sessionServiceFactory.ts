import type { ListResponse, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { AccessTokenResponse, ListRequest, RenewRequest, RevokeRequest, SessionDto } from "~/types/request.types";

export const sessionServiceFactory = {
    list: (dto: ListRequest) => apiContractBuilderHelper.get('/api/Session/list')
        .withService(IDENTITY_SERVICE)
        .withQueryParams<ListRequest>(dto)
        .withResponse<ListResponse<SessionDto[]>>()
        .build(),

    revoke: (body: RevokeRequest) => apiContractBuilderHelper.post('/api/Session/revoke')
        .withService(IDENTITY_SERVICE)
        .withBody(body)
        .withResponse<SuccessResponse>()
        .build(),

    renew: (body: RenewRequest) => apiContractBuilderHelper.post('/api/Session/renew')
        .withService(IDENTITY_SERVICE)
        .withBody(body)
        .withResponse<AccessTokenResponse>()
        .build()
}