import type { BaseDto } from "./request.types";
import type { FieldTransformer } from "./transformers.types";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ErrorResult {
  message: string;
  fieldErrors?: Record<string, string>;
}

export interface IProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[] | string>;
}

export interface IRequestConfig<
  TRoute = Record<string, string | number>,
  TQueryParams = Record<string, unknown>,
  TBody = unknown,
> {
  endpoint: string;
  method: HttpMethod;
  routeParams?: TRoute;
  queryParams?: TQueryParams;
  body?: TBody;
  headers?: Record<string, string>;
  service?: ServiceType;
  fieldTransformers?: Record<string, FieldTransformer>;
  isFormData?: boolean;
}

export interface PagingParams extends Record<string, unknown> {
  limit?: number;
  offset?: number;
}

export interface SuccessResponse {
  success: true;
}

export type SingleJsonStringResponse = string;

export type ServiceType = "Identity" | "Workspace" | "Project";

export interface Column {
  label: string;
  field: string;
  renderer?: (row: Record<string, any>) => string;
}

export interface HttpClientResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export enum NotificationLevel {
  Success = "Success",
  Info = "Info",
  Warning = "Warning",
  Error = "Error",
}

export interface WebNotificationDto {
  userId: string;
  level: NotificationLevel;
  title: string;
  message: string;
}

export interface ListResponse<T> {
  data: T;
  totalCount: number;
}