import type {
  HttpMethod,
  IRequestConfig,
  ServiceType,
} from "~/types/api.types";
import type { TypedTransformers } from "~/types/transformers.types";
import { ApiContract } from "./apiContract";

type ExtractPathParams<T extends string> =
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractPathParams<Rest>]: string | number }
    : T extends `${infer _Start}:${infer Param}`
      ? { [K in Param]: string | number }
      : Record<string, never>;

export class ApiContractBuilder<
  TRoute extends Record<string, string | number> = Record<string, never>,
  TQueryParams extends Record<string, unknown> = Record<string, never>,
  TBody = unknown,
  TResponse = unknown,
> {
  private config: IRequestConfig<TRoute, TQueryParams, TBody>;

  constructor(endpoint: string, method: HttpMethod, service?: ServiceType) {
    this.config = { endpoint, method, service };
  }

  withPath<TRouteNew extends Record<string, string | number>>(
    route: TRouteNew
  ): ApiContractBuilder<TRouteNew, TQueryParams, TBody, TResponse> {
    return new ApiContractBuilder<TRouteNew, TQueryParams, TBody, TResponse>(
      this.config.endpoint,
      this.config.method,
      this.config.service
    ).withConfig({
      ...this.config,
      routeParams: route,
    }) as ApiContractBuilder<TRouteNew, TQueryParams, TBody, TResponse>;
  }

  withQueryParams<TQueryParamsNew extends Record<string, unknown>>(
    queryParams: TQueryParamsNew
  ): ApiContractBuilder<TRoute, TQueryParamsNew, TBody, TResponse> {
    return new ApiContractBuilder<TRoute, TQueryParamsNew, TBody, TResponse>(
      this.config.endpoint,
      this.config.method,
      this.config.service
    ).withConfig({
      ...this.config,
      queryParams,
    }) as ApiContractBuilder<TRoute, TQueryParamsNew, TBody, TResponse>;
  }

  withBody<TBodyNew>(
    body: TBodyNew
  ): ApiContractBuilder<TRoute, TQueryParams, TBodyNew, TResponse> {
    return new ApiContractBuilder<TRoute, TQueryParams, TBodyNew, TResponse>(
      this.config.endpoint,
      this.config.method,
      this.config.service
    ).withConfig({
      ...this.config,
      body,
    }) as ApiContractBuilder<TRoute, TQueryParams, TBodyNew, TResponse>;
  }

  withHeaders(
    headers: Record<string, string>
  ): ApiContractBuilder<TRoute, TQueryParams, TBody, TResponse> {
    return new ApiContractBuilder<TRoute, TQueryParams, TBody, TResponse>(
      this.config.endpoint,
      this.config.method,
      this.config.service
    ).withConfig({
      ...this.config,
      headers: {
        ...this.config.headers,
        ...headers,
      },
    });
  }

  withResponse<TResponseNew>(): ApiContractBuilder<
    TRoute,
    TQueryParams,
    TBody,
    TResponseNew
  > {
    return this as unknown as ApiContractBuilder<
      TRoute,
      TQueryParams,
      TBody,
      TResponseNew
    >;
  }

  withService(
    service: ServiceType
  ): ApiContractBuilder<TRoute, TQueryParams, TBody, TResponse> {
    return new ApiContractBuilder<TRoute, TQueryParams, TBody, TResponse>(
      this.config.endpoint,
      this.config.method
    ).withConfig({
      ...this.config,
      service,
    });
  }

  withFormData(): ApiContractBuilder<TRoute, TQueryParams, TBody, TResponse> {
    return new ApiContractBuilder<TRoute, TQueryParams, TBody, TResponse>(
      this.config.endpoint,
      this.config.method,
      this.config.service
    ).withConfig({
      ...this.config,
      isFormData: true,
    });
  }

  withTransformers<T>(
    fieldTransformers: TypedTransformers<T>
  ): ApiContractBuilder<TRoute, TQueryParams, TBody, TResponse> {
    return new ApiContractBuilder<TRoute, TQueryParams, TBody, TResponse>(
      this.config.endpoint,
      this.config.method,
      this.config.service
    ).withConfig({
      ...this.config,
      fieldTransformers: {
        ...(this.config.fieldTransformers || {}),
        ...fieldTransformers,
      },
    });
  }

  buildUrl(): string {
    const config = useRuntimeConfig();
    let baseUrl = "";

    switch (this.config.service) {
      case "Identity":
        baseUrl = config.public.identityApiUrl;
        break;
      case "Workspace":
        baseUrl = config.public.workspaceApiUrl;
        break;
      case "Project":
        baseUrl = config.public.projectApiUrl;
        break;
      default:
        baseUrl = config.public.identityApiUrl;
        break;
    }

    let url = `${baseUrl}${this.config.endpoint}`;

    if (this.config.routeParams) {
      Object.entries(this.config.routeParams).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          throw new Error(
            `Route parameter "${key}" is required but was ${value}`
          );
        }
        url = url.replace(`:${key}`, encodeURIComponent(String(value)));
      });

      const remainingParams = url.match(/:([a-zA-Z0-9_]+)/g);
      if (remainingParams) {
        throw new Error(
          `Missing route parameters: ${remainingParams.join(", ")}`
        );
      }
    }

    if (
      this.config.queryParams &&
      Object.keys(this.config.queryParams).length > 0
    ) {
      const queryParams = new URLSearchParams();
      Object.entries(this.config.queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        url = `${url}?${queryString}`;
      }
    }
    return url;
  }

  build(): ApiContract<TResponse> {
    const config = {
      ...this.config,
      endpoint: this.buildUrl(),
    };

    return new ApiContract<TResponse>(config);
  }

  private withConfig(
    config: Partial<IRequestConfig<TRoute, TQueryParams, TBody>>
  ): ApiContractBuilder<TRoute, TQueryParams, TBody, TResponse> {
    Object.assign(this.config, config);
    return this;
  }
}

export const apiContractBuilderHelper = {
  get: <T extends string>(endpoint: T) =>
    new ApiContractBuilder<ExtractPathParams<T>>(endpoint, "GET"),
  post: <T extends string>(endpoint: T) =>
    new ApiContractBuilder<ExtractPathParams<T>>(endpoint, "POST"),
  put: <T extends string>(endpoint: T) =>
    new ApiContractBuilder<ExtractPathParams<T>>(endpoint, "PUT"),
  patch: <T extends string>(endpoint: T) =>
    new ApiContractBuilder<ExtractPathParams<T>>(endpoint, "PATCH"),
  delete: <T extends string>(endpoint: T) =>
    new ApiContractBuilder<ExtractPathParams<T>>(endpoint, "DELETE"),
  uploadFile: <T extends string>(endpoint: T) =>
    new ApiContractBuilder<ExtractPathParams<T>>(
      endpoint,
      "POST"
    ).withFormData(),
  uploadForm: <T extends string>(endpoint: T) =>
    new ApiContractBuilder<ExtractPathParams<T>>(
      endpoint,
      "POST"
    ).withFormData(),
  postForm: <T extends string>(endpoint: T) =>
    new ApiContractBuilder<ExtractPathParams<T>>(
      endpoint,
      "POST"
    ).withFormData(),
};