import type { ListResponse } from "./api.types";
import type { BaseDirectoryDto, BaseDirectoryRequest, BaseDto, FileDeleteRequest, ListRequest } from "./request.types";

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type BaseApiContract<T extends BaseDto> = {
  list: (params: ListRequest) => Promise<T[]>
  get: (id: string) => Promise<T | null>
}

export interface BaseDataStore<T extends BaseDto> {
  data: T[]
  loading: boolean
  limit: number
  offset: number
  includeDeleted: boolean
  totalCount: number
  currentPage: number
  list: () => Promise<ListResponse<Partial<T>[]> | undefined>
  nextPage: () => void
  prevPage: () => void
  reset: () => void
}

export interface BaseDirectoryStore<T extends BaseDirectoryDto>
  extends BaseDataStore<T> {
  create: (item: BaseDirectoryRequest) => Promise<void>
  update: (item: BaseDirectoryRequest) => Promise<void>
  delete: (id: string) => Promise<void>
  get: (id: string) => Promise<T | null>
  uploadArtifact: (id: string, file: File) => Promise<void>
  deleteArtifact: (objectId: string, dto: FileDeleteRequest) => Promise<void>
}

export type Option = {
  label: string
  value: string
}