import type { NotificationTypes } from "./services.types"

export interface RenewRequest {
  refreshToken: string;
  accessToken: string;
}

export interface RevokeRequest {
  id: string;
}

export interface SignInRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpRequest {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface CreateSkillRequest {
  name: string;
}

export interface UpdateSkillRequest {
  id: string;
  name: string;
}

export interface RoleRequest {
  roleId: string;
}

export interface SkillRequest {
  skillId: string;
}

export interface UpdateUserRequest {
  email?: string;
  phoneNumber?: string;
  password?: string;
  isDeleted?: boolean;
}

export interface VerifyUserRequest {
  id: string;
  code: string;
  type: NotificationTypes;
}

export interface GenerateVerificationCodeRequest {
  email: string;
  type: NotificationTypes;
}

export interface RecoverPasswordRequest {
  password: string;
  verificationCode: string;
}

export interface CreateUserRoleRequest {
  name: string;
}

export interface UpdateUserRoleRequest {
  id: string;
  name?: string;
}

export interface CreateUserRoleClaimsRequest {
  roleId: string;
  claimType: string;
  claimValue: string;
}

export interface UpdateUserRoleClaimsRequest {
  claimType: string;
  claimValue: string;
}

export interface CreateUserScheduleRequest {
  userId: string;
  date: string;
  startAt: string;
  endAt: string;
}

export interface UpdateUserScheduleRequest {
  date?: string;
  startAt?: string;
  endAt?: string;
}

export interface CreateProjectRequest {
  workspaceId: string;
  name: string;
}

export interface UpdateProjectRequest {
  projectId: string;
  name: string;
  isDeleted?: boolean;
}

export interface DeleteProjectRequest extends Record<string, unknown> {
  projectId: string;
}

export interface RestoreProjectRequest {
  projectId: string;
}

export interface AddUserRequest {
  id: string;
  userId: string;
}

export interface DeleteUserRequest extends Record<string, unknown> {
  id: string;
  userId: string;
}

export interface CreateProjectRoleRequest {
  name: string;
  projectId: string;
}

export interface UpdateProjectRoleRequest {
  id: string;
  name: string;
}

export interface CreateProjectRoleClaimsRequest {
  value: string;
  roleId: string;
}

export interface UpdateProjectRoleClaimsRequest {
  id: string;
  value: string;
}

export interface CreateProjectThreadRequest {
  projectId: string;
  fromId: string;
  title: string;
  text: string;
}

export interface UpdateProjectThreadRequest {
  id: string;
  fromId: string;
  title: string;
  text: string;
  isDeleted?: boolean;
}

export interface CreateProjectThreadCommentRequest {
  threadId: string;
  fromId: string;
  text: string;
}

export interface UpdateProjectThreadCommentRequest {
  threadCommentId: string;
  text: string;
  isDeleted?: boolean;
}

export interface CreateSectionRequest {
  projectId: string;
  name: string;
}

export interface UpdateSectionRequest {
  sectionId: string;
  name: string;
  isDeleted?: boolean;
}

export interface CreateTaskRequest {
  id: string;
  name: string;
  isArchived: boolean;
  startedDate: string;
  endDate: string;
}

export interface UpdateTaskRequest {
  id: string;
  name: string;
  isArchived: boolean;
  isDeleted?: boolean;
  startedDate?: string;
  endDate?: string;
}

export interface AddTaskAssigneeRequest {
  taskId: string;
  userId: string;
}

export interface RemoveTaskAssigneeRequest {
  taskId: string;
  userId: string;
}

export interface CreateTaskActivityRequest {
  projectId: string;
  taskId: string;
  activityId: string;
  fromId: string;
  date: string;
  workHours: number;
}

export interface UpdateTaskActivityRequest {
  taskActivityId: string;
  taskId: string;
  activityId: string;
  fromId: string;
  workHours: number;
}

export interface CreateTaskCommentRequest {
  taskId: string;
  authorId: string;
  content: string;
}

export interface UpdateTaskCommentRequest {
  id: string;
  fromId: string;
  content?: string;
}

export interface CreateTaskCommentRequest {
  taskId: string;
  authorId: string;
  content: string;
}

export interface UpdateTaskCommentRequest {
  id: string;
  fromId: string;
  content?: string;
}

export interface CreateTaskDirectoryRequest {
  taskId: string;
  name: string;
}

export interface UpdateTaskDirectoryRequest {
  id: string;
  name: string;
  isDeleted?: boolean;
}

export interface CreateTaskEvaluationRequest {
  taskId: string;
  activityId: string;
  hours: number;
}

export interface UpdateTaskEvaluationRequest {
  evaluationId: string;
  activityId: string;
  hours: number;
}

export interface CreateTaskTodoListRequest {
  taskId: string;
}

export interface UpdateTaskTodoListRequest {
  id: string;
  isDeleted?: boolean;
}

export interface CreateTaskTodoListItemRequest {
  taskTodoListId: string;
  name: string;
  duration: number;
  startedDate: string;
  endDate?: string;
}

export interface UpdateTaskTodoListItemRequest {
  id: string;
  name: string;
  duration: number;
  isCompleted: boolean;
  completedAt?: string;
  startedDate: string;
  endDate?: string;
}

export interface CreateWorkspaceRequest {
  name: string;
}

export interface UpdateWorkspaceRequest {
  name: string;
}

export interface CreateWorkspaceDirectoryRequest {
  workspaceId: string;
  name: string;
}

export interface UpdateWorkspaceDirectoryRequest {
  name: string;
}

export interface CreateWorkspacePositionRequest {
  workspaceId: string;
  name: string;
}

export interface UpdateWorkspacePositionRequest {
  name: string;
}

export interface CreateWorkspaceRoleRequest {
  workspaceId: string;
  name: string;
}

export interface UpdateWorkspaceRoleRequest {
  name: string;
}

export interface CreateWorkspaceRoleClaimRequest {
  roleId: string;
  value: string;
}

export interface UpdateWorkspaceRoleClaimRequest {
  value: string;
}

export interface InviteWorkspaceUserRequest extends Record<string, unknown> {
  id: string;
  userId: string;
}

export interface UpdateWorkspaceUserRequest {
  roleId: string;
  positionId: string;
}

export interface DeleteWorkspaceUserRequest extends Record<string, unknown> {
  id: string;
  userId: string;
}

export interface DeleteFileRequest extends Record<string, unknown> {
  id: string;
  fromId: string;
}

export interface UploadFileRequest {
  fromId: string;
  content: number[];
  fileName: string;
  contentType: string;
}