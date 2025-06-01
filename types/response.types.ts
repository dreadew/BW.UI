import type { PagingParams } from "./api.types";
import type { GrpcUserDto } from "./common.types";

export interface AccessTokenResponse {
  accessToken: string;
  expiresAt: string;
}

export interface TokensResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface Session {
  id: string;
  userId: string;
  location: string;
  isRevoked: string;
  createdAt: string;
  expiresAt: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  username: string;
  photoPathWithUrl?: string;
  isSuspended: boolean;
  isVerified: boolean;
  phoneNumberConfirmed: boolean;
  roles: UserRole[];
  skills: Skill[];
  schedules: UserSchedule[];
  sessions: Session[];
}

export const NotificationTypes = {
  ACCOUNT_CONFIRMATION: "ACCOUNT_CONFIRMATION",
  PHONE_CONFIRMATION: "PHONE_CONFIRMATION",
  RECOVER_PASSWORD: "RECOVER_PASSWORD",
  RECOVER_LOGIN: "RECOVER_LOGIN",
} as const;

export type NotificationTypes =
  (typeof NotificationTypes)[keyof typeof NotificationTypes];

export interface UserRole {
  id: string;
  name: string;
  claims: UserRoleClaim[];
  createdAt: string;
  modifiedAt: string;
}

export interface UserRoleClaim {
  id: string;
  claimType: string;
  claimValue: string;
}

export interface UserSchedule {
  id: string;
  date: string;
  startAt: string;
  endAt: string;
}

export interface ProjectDto {
  id: string;
  name: string;
  picturePath: string;
  isDeleted: boolean;
}

export interface ProjectRoleDto {
  name: string;
  claims: ProjectRoleClaimsDto[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProjectRoleClaimsDto {
  id: string;
  value: string;
}

export interface ProjectThreadDto {
  id: string;
  userId: string;
  title: string;
  slug: string;
  text: string;
  isArchived: boolean;
  isClosed?: boolean;
  isDeleted: boolean;
  comments: ProjectThreadCommentDto[];
  createdAt: string;
  modifiedAt?: string;
}

export interface ProjectThreadCommentDto {
  id: string;
  userId: string;
  text: string;
  isDeleted: boolean;
  createdAt: string;
  modifiedAt?: string;
}

export interface SectionDto {
  id: string;
  name: string;
  tasks: ShortTaskDto[];
  createdAt: string;
  modifiedAt?: string;
}

export interface TaskDto {
  id: string;
  name: string;
  content: string;
  isArchived: boolean;
  priorityType: PriorityTypeDto;
  author: ProjectUserDto;
  analytic?: ProjectUserDto;
  assignees: TaskAssigneeDto[];
  directories: TaskDirectoryDto[];
  activities: TaskActivityDto[];
  todoLists: TaskTodoListDto[];
  evaluations: TaskEvaluationDto[];
  relations: TaskRelationDto[];
  comments: TaskCommentDto[];
  position: number;
  startedDate?: string;
  endDate?: string;
  createdAt: string;
  modifiedAt?: string;
}

export interface ShortTaskDto {
  id: string;
  name: string;
  analytic: ProjectUserDto;
  author: ProjectUserDto;
  assignees: TaskAssigneeDto[];
  startedDate?: string;
  endDate?: string;
  createdAt: string;
  modifiedAt?: string;
}

export interface TaskRelationDto {
  id: string;
  relatedTaskId: string;
  relationType: RelationTypeDto;
}

export interface ActivityTypeDto {
  id: string;
  name: string;
}

export interface ProjectUserDto {
  userId: string;
  role: ProjectRoleDto;
  user?: GrpcUserDto;
}

export interface TaskAssigneeDto {
  userId: string;
  role: ProjectRoleDto;
  user?: User;
}

export interface PriorityTypeDto {
  id: string;
  name: string;
}

export interface TaskPositionDto {
  sectionId: string;
  taskId: string;
  position: number;
}

export interface TaskActivityDto {
  id: string;
  userId: string;
  date: string;
  workHours: number;
  createdAt: string;
  modifiedAt?: string;
}

export interface TaskCommentDto {
  id: string;
  author: ProjectUserDto;
  content: string;
  createdAt: string;
  modifiedAt?: string;
}

export interface TaskCommentDto {
  id: string;
  author: ProjectUserDto;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  modifiedAt?: string;
}

export interface TaskDirectoryDto {
  id: string;
  name: string;
  children: TaskDirectoryDto[];
  artifacts: TaskDirectoryArtifactDto[];
  createdAt: string;
  modifiedAt?: string;
}

export interface TaskDirectoryArtifactDto {
  id: string;
  name: string;
  path: string;
  createdAt: string;
  modifiedAt?: string;
}

export interface TaskEvaluationDto {
  id: string;
  activityType: ActivityTypeDto;
  hours: number;
  createdAt: string;
  modifiedAt?: string;
}

export interface TaskTodoListDto {
  id: string;
  items: TaskTodoListItemDto[];
}

export interface TaskTodoListItemDto {
  id: string;
  name: string;
  duration: number;
  isCompleted: boolean;
  completedAt?: string;
  startedDate: string;
  endDate: string;
  createdAt: string;
  modifiedAt?: string;
}

export interface WorkspacePagingParams extends PagingParams {
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  pictureUrl: string;
  roles: WorkspaceRole[];
  positions: WorkspacePosition[];
  users: WorkspaceUser[];
  directories: WorkspaceDirectory;
  createdAt: Date;
  modifiedAt: Date;
}

export interface WorkspaceDirectoryArtifact {
  id: string;
  name: string;
  path: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface WorkspaceDirectory {
  id: string;
  name: string;
  children: WorkspaceDirectory[];
  artifacts: WorkspaceDirectoryArtifact[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface WorkspacePosition {
  id: string;
  name: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface WorkspaceRole {
  id: string;
  name: string;
  claims: WorkspaceRoleClaim[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface WorkspaceRoleClaim {
  id: string;
  value: string;
}

export interface WorkspaceUser {
  userId: string;
  role: WorkspaceRole;
  position: WorkspacePosition;
  user: User;
}

export interface RelationTypeDto {
  id: string;
  name: string;
}