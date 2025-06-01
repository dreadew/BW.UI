import type { PagingParams, SuccessResponse } from "~/types/api.types";
import { apiContractBuilderHelper } from "../apiContractBuilder";
import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { RevokeRequest, RenewRequest } from "~/types/request.types";
import type { Session, AccessTokenResponse } from "~/types/response.types";

export const sessionServiceFactory = {
    list: (params: PagingParams) => apiContractBuilderHelper.get('/api/Session/list')
        .withService(IDENTITY_SERVICE)
        .withQueryParams(params)
        .withResponse<Session[]>()
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