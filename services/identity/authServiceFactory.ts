import { apiContractBuilderHelper } from "../apiContractBuilder";
import { IDENTITY_SERVICE } from "~/constants/services.constants";
import type { SuccessResponse } from "~/types/api.types";
import type { SignInRequest, SignUpRequest, TokensResponse } from "~/types/request.types";

export const authServiceFactory = {
  login: (body: SignInRequest) =>
    apiContractBuilderHelper
      .post("/api/Auth/sign-in")
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<TokensResponse>()
      .build(),

  register: (body: SignUpRequest) =>
    apiContractBuilderHelper
      .post("/api/Auth/sign-up")
      .withService(IDENTITY_SERVICE)
      .withBody(body)
      .withResponse<SuccessResponse>()
      .build(),
};
