import type { NotificationTypes, } from "./response.types";

/**
 * DTO для получения
 * списков
 */
export interface ListRequest {
    limit: number;
    offset: number;
    includeDeleted: boolean;
}

/**
 * DTO для получения
 * списков с идентификатором 
 * пользователя
 */
export interface ListRequestWithUserId extends ListRequest {
    userId: string;
}

/**
 * DTO для получения
 * списков с идентификатором
 * задачи
 */
export interface ListRequestWithTaskId extends ListRequest {
    taskId: string;
}

/**
 * DTO для удаления файла
 */
export interface FileDeleteRequest {
    id: string;
    fromId: string;
}

/**
 * DTO для загрузки файла
 */
export interface FileUploadRequest {
    fromId: string;
    content: number[];
    fileName: string;
    contentType: string;
}

/**
 * DTO для получения стрима
 * файла
 */
export interface GetFileStreamDto {
    fileName: string;
    // stream: Stream;
    contentType: string;
}

/**
 * DTO с информацией о пользователе
 * через gRPC
 */
export interface GrpcUserDto extends BaseDto {
    username: string;
    email: string;
    phoneNumber: string;
    photoPath: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Базовое DTO
 */
export interface BaseDto {
    id: string;
}

/**
 * Базовое DTO для сущностей
 * с мягким удалением
 */
export interface BaseSoftDeletableDto extends BaseDto {
    isDeleted: boolean;
    createdAt: string;
    updatedAt?: string;
}

/**
 * Базовое DTO для константных
 * сущностей
 */
export interface BaseConstantDto extends BaseSoftDeletableDto {
    name: string;
}

// IDENTITY SERVICE
// Auth DTOs

/**
 * DTO с обновленным
 * access токеном и сроком
 * действия
 */
export interface AccessTokenResponse {
    accessToken: string;
    expiresAt: string;
}

/**
 * DTO для входа
 * в систему
 */
export interface SignInRequest {
    username: string;
    password: string;
    rememberMe: boolean;
}

/**
 * DTO для регистрации
 * в системе
 */
export interface SignUpRequest {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
}

/**
 * DTO с токенами
 * пользователя 
 * (устанавливается в куки)
 */
export interface TokensResponse {
    userId: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt: string;
}

// Session DTOs

/**
 * DTO для обновления
 * access токена
 */
export interface RenewRequest {
    refreshToken: string;
    accessToken: string;
}

/**
 * DTO для отзыва
 * сессии
 */
export interface RevokeRequest extends BaseDto { }

/**
 * DTO сессии
 */
export interface SessionDto extends BaseDto {
    userId: string;
    location: string;
    isRevoked: string;
    createdAt: string;
    updatedAt: string;
}

// Role DTOs

/**
 * DTO для создания роли
 */
export interface CreateRoleRequest {
    name: string;
}

/**
 * DTO для обновления роли
 */
export interface UpdateRoleRequest extends BaseDto {
    name: string;
    isDeleted?: boolean;
}

/**
 * DTO глобальной роли
 */
export interface RoleDto extends BaseSoftDeletableDto {
    claims: RoleClaimsDto[];
}

// Role claims DTOs

/**
 * DTO глобального клейма
 */
export interface RoleClaimsDto extends BaseDto {
    roleId: string;
    claimType: string;
    claimValue: string;
}

/**
 * DTO для создания клейма
 * глобальной роли
 */
export interface CreateRoleClaimsRequest {
    roleId: string;
    claimType: string;
    claimValue: string;
}

// Skill DTOs

/**
 * DTO для создания навыка
 */
export interface CreateSkillRequest {
    name: string;
}

/**
 * DTO навыка
 */
export interface SkillDto extends BaseSoftDeletableDto { }

/**
 * DTO для обновления навыка
 */
export interface UpdateSkillRequest extends BaseDto {
    name: string;
    isDeleted?: boolean;
}

// User DTOs

/**
 * DTO для восстановления
 * пароля
 */
export interface RecoverPasswordRequest extends BaseDto {
    password: string;
    verificationCode: string;
}

/**
 * DTO для генерации
 * кода подтверждения
 */
export interface GenerateVerificationCodeRequest {
    email: string;
    type: NotificationTypes;
}

/**
 * DTO для добавления
 * и удаления глобальной роли 
 * пользователя
 */
export interface RoleRequest extends BaseDto {
    roleId: string;
}

/**
 * DTO для добавления
 * и удаления навыка пользователя
 */
export interface SkillRequest extends BaseDto {
    skillId: string;
}

/**
 * DTO для обновления
 * пользователя
 */
export interface UpdateUserRequest extends BaseDto {
    email: string;
    phoneNumber: string;
    password: string;
    isDeleted?: boolean;
}

/**
 * DTO с данными
 * пользователя
 */
export interface UserDto extends BaseSoftDeletableDto {
    username: string;
    email: string;
    phoneNumber: string;
    photoPathWithUrl: string;
    isSuspended: boolean;
    isVerified: boolean;
    phoneNumberConfirmed: boolean;
    roles: RoleDto[];
    skills: SkillDto[];
    userSchedules: UserScheduleDto[];
    sessions: SessionDto[];
}

/**
 * DTO для верификации
 * пользователя
 */
export interface VerifyRequest extends BaseDto {
    code: string;
    type: NotificationTypes;
}

// User Schedule DTOs

/**
 * DTO для создания
 * расписания пользователя
 */
export interface CreateUserScheduleRequest extends BaseDto {
    date: string;
    startAt: string;
    endAt: string;
}

/**
 * DTO для обновления
 * расписания пользователя
 */
export interface UpdateUserScheduleRequest extends BaseDto {
    date: string;
    startAt: string;
    endAt: string;
    isDeleted?: boolean;
}

/**
 * DTO с расписанием
 * пользователя
 */
export interface UserScheduleDto extends BaseSoftDeletableDto {
    date: string;
    startAt: string;
    endAt: string;
}

// WORKSPACE SERVICE
// Workspace directory DTOs

/**
 * DTO для создания директории
 * рабочего пространства
 */
export interface CreateDirectoryRequest extends BaseDto {
    name: string;
    parentId: string;
}

/**
 * DTO для обновления директории
 * рабочего пространства
 */
export interface UpdateDirectoryRequest extends BaseDto {
    name?: string;
}

/**
 * DTO директории рабочего
 * пространства
 */
export interface DirectoryDto extends BaseSoftDeletableDto {
    name: string;
    parent?: DirectoryDto;
    children: DirectoryDto[];
    artifacts: ArtifactDto[];
}

/**
 * DTO артефакта
 * рабочего пространства
 */
export interface ArtifactDto extends BaseDto {
    name: string;
    path: string;
    createdAt: string;
    updatedAt?: string;
}

// Position DTOs

/**
 * DTO для создания должности
 * рабочего пространства
 */
export interface CreatePositionRequest extends BaseDto {
    name: string;
}

/**
 * DTO должности рабочего пространства
 */
export interface PositionDto extends BaseConstantDto { }

/**
 * DTO для обновления должности
 * рабочего пространства
 */
export interface UpdatePositionRequest extends BaseDto {
    name: string;
    isDeleted?: boolean;
}

// Workspace Role Claims DTOs

/**
 * DTO для создания клейма
 * роли рабочего пространства
 */
export interface CreateWorkspaceRoleClaimsRequest {
    value: string;
}

/**
 * DTO для обновления клейма
 * роли рабочего пространства
 */
export interface UpdateWorkspaceRoleClaimsRequest extends BaseDto {
    value?: string;
}

/**
 * DTO клейма роли
 * рабочего пространства
 */
export interface WorkspaceRoleClaimsDto extends BaseDto {
    value: string;
}

/**
 * DTO для создания роли 
 * рабочего пространства
 */
export interface CreateWorkspaceRoleRequest extends BaseDto {
    name: string;
}

/**
 * DTO для обновления роли
 * рабочего пространства
 */
export interface UpdateWorkspaceRoleRequest extends BaseDto {
    name: string;
    isDeleted?: boolean;
}

/**
 * DTO роли рабочего
 * пространства
 */
export interface WorkspaceRoleDto extends BaseSoftDeletableDto {
    name: string;
    claims: WorkspaceRoleClaimsDto[];
}

// Workspace DTOs

/**
 * DTO для создания
 * рабочего пространства
 */
export interface CreateWorkspaceRequest {
    name: string;
}

/**
 * DTO для удаления
 * рабочего пространства
 */
export interface DeleteWorkspaceRequest extends BaseDto { }

/**
 * DTO для восстановления
 * рабочего пространства
 */
export interface RestoreWorkspaceRequest extends BaseDto { }

/**
 * DTO для обновления
 * рабочего пространства
 */
export interface UpdateWorkspaceRequest extends BaseDto {
    name: string;
    isDeleted?: boolean;
}

/**
 * DTO рабочего пространства
 */
export interface WorkspaceDto extends BaseSoftDeletableDto {
    name: string;
    pictureUrl: string;
    roles: WorkspaceRoleDto[];
    directories: DirectoryDto[];
    positions: PositionDto[];
    users: WorkspaceUserDto[];
}

/**
 * DTO рабочего пространства
 * без фотографии
 */
export interface WorkspaceWithAdditionalInfoDto extends BaseSoftDeletableDto {
    name: string;
    roles: WorkspaceRoleDto[];
    directories: DirectoryDto[];
    positions: PositionDto[];
    users: WorkspaceUserDto[];
}

/**
 * DTO для удаления пользователя
 * из рабочего пространства
 */
export interface DeleteWorkspaceUserRequest extends BaseDto {
    userId: string;
}

/**
 * DTO для добавления пользователя
 * в рабочее пространство
 */
export interface InviteWorkspaceUserRequest extends BaseDto {
    userId: string;
}

/**
 * DTO для обновления информации
 * о пользователе в рабочем пространстве
 */
export interface UpdateWorkspaceUserRequest extends BaseDto {
    userId: string;
    roleId?: string;
    positionId?: string;
}

/**
 * DTO с информацией о пользоватлее
 * в рабочем пространстве
 */
export interface WorkspaceUserDto extends BaseDto {
    role: WorkspaceRoleDto;
    position: PositionDto;
    user: GrpcUserDto;
}

// PROJECT SERVICE
// Project DTOs

/**
 * DTO для создания проекта
 */
export interface CreateProjectRequest extends BaseDto {
    name: string;
}

/**
 * DTO для удаления проекта
 */
export interface DeleteProjectRequest extends BaseDto { }

/**
 * DTO для обновления проекта
 */
export interface UpdateProjectRequest extends BaseDto {
    name: string;
    isDeleted?: boolean;
}

/**
 * DTO с краткой информацией
 * о проекте
 */
export interface ShortProjectDto extends BaseSoftDeletableDto {
    name: string;
    pictureUrl: string;
}

/**
 * DTO с информацией
 * о проекте
 */
export interface ProjectDto extends BaseSoftDeletableDto {
    name: string;
    pictureUrl?: string;
    threads: ProjectThreadDto[];
    roles: ProjectRoleDto[];
    sections: SectionDto[];
}

// Project Role DTOs

/**
 * DTO для создания
 * роли проекта
 */
export interface CreateProjectRoleRequest extends BaseDto {
    name: string;
}

/**
 * DTO для обновления
 * роли проекта
 */
export interface UpdateProjectRoleRequest extends BaseDto {
    name: string;
}

/**
 * DTO роли проекта
 */
export interface ProjectRoleDto extends BaseSoftDeletableDto {
    name: string;
    claims: ProjectRoleClaimsDto[];
}

// Project Role Claims DTOs

/**
 * DTO клейма роли проекта
 */
export interface ProjectRoleClaimsDto extends BaseDto {
    value: string;
}

/**
 * DTO для создания клейма
 * роли проекта
 */
export interface CreateProjectRoleClaimsRequest extends BaseDto {
    value: string;
}

/**
 * DTO для обновления клейма
 * роли проекта
 */
export interface UpdateProjectRoleClaimsRequest extends BaseDto {
    value?: string;
}

// Task Activity DTOs

/**
 * DTO для создания отметки
 * в журнале активности
 */
export interface CreateTaskActivityRequest extends BaseDto {
    activityId: string;
    date: string;
    workHours: number;
}

/**
 * DTO для обновления отметки
 * в журнале активности
 */
export interface UpdateTaskActivityRequest extends BaseDto {
    activityId: string;
    date: string;
    workHours: number;
}

/**
 * DTO записи из
 * журнала активности
 */
export interface TaskActivityDto extends BaseDto {
    userId: string;
    date: string;
    workHours: number;
    activityType: BaseConstantDto;
    createdAt: string;
    updatedAt?: string;
}

// Task DTOs

/**
 * DTO для обновления
 * задачи
 */
export interface UpdateTaskRequest extends BaseDto {
    name: string;
    content: string;
    priorityTypeId?: string;
    analyticId?: string;
    sectionId?: string;
    isArchived?: boolean;
    isDeleted?: boolean;
    startedDate?: string;
    endDate?: string;
}

/**
 * DTO для создания
 * задачи
 */
export interface CreateTaskRequest extends BaseDto {
    sectionId: string;
    priorityTypeId: string;
    userId: string;
    name: string;
    content: string;
    isArchived?: boolean;
    startedDate?: string;
    endDate?: string;
}

/**
 * DTO с позицией
 * задачи
 */
export interface TaskPositionDto extends BaseDto {
    sectionId: string;
    position: number;
}

/**
 * DTO для отношений
 * задачи
 */
export interface TaskRelationDto extends BaseDto {
    relatedTaskId: string;
    relationTypeId: string;
}

/**
 * DTO для добавления спринта
 * к задаче
 */
export interface AddTaskSprintRequest extends BaseDto {
    sprintId: string;
}

/**
 * DTO для удаления спринта
 * у задачи
 */
export interface RemoveTaskSprintRequest extends BaseDto {
    sprintId: string;
}

/**
 * DTO задачи
 */
export interface TaskDto extends BaseSoftDeletableDto {
    name: string;
    content: string;
    isArchived: boolean;
    priorityType: BaseConstantDto;
    author: ProjectUserDto;
    analytic?: ProjectUserDto;
    position: number;
    assignees: TaskAssigneeDto[];
    directories: TaskDirectoryDto[];
    activities: TaskActivityDto[];
    todoLists: TaskTodoListDto[];
    evaluations: TaskEvaluationDto[];
    relations: TaskRelationDto[];
    comments: TaskCommentDto[];
    startedDate?: string;
    endDate?: string;
}

/**
 * Краткое DTO задачи
 */
export interface ShortTaskDto extends BaseSoftDeletableDto {
    name: string;
    analytic: ProjectUserDto;
    author: ProjectUserDto;
    assignees: TaskAssigneeDto[];
    startedDate?: string;
    endDate?: string;
}

/**
 * DTO для добавления
 * исполнителя задачи
 */
export interface AddTaskAssigneeRequest extends BaseDto {
    userId: string;
}

/**
 * DTO для удаления
 * исполнителя задачи
 */
export interface RemoveTaskAssigneeRequest extends BaseDto {
    userId: string;
}

/**
 * DTO исполнителя задачи
 */
export interface TaskAssigneeDto {
    userId: string;
    role: ProjectRoleDto;
    user: GrpcUserDto;
}

// Task Comment DTOs

/**
 * DTO для создания комментария
 * к задаче
 */
export interface CreateTaskCommentRequest extends BaseDto {
    content: string;
}

/**
 * DTO для обновления комментария задачи
 */
export interface UpdateTaskCommentRequest extends BaseDto {
    content?: string;
}

/**
 * DTO комментария задачи
 */
export interface TaskCommentDto extends BaseSoftDeletableDto {
    author: ProjectUserDto;
    content: string;
}

// Task Directory DTOs

/**
 * DTO для создания
 * директории задачи
 */
export interface CreateTaskDirectoryRequest extends BaseDto {
    name: string;
}

/**
 * DTO для обновления
 * директории задачи
 */
export interface UpdateTaskDirectoryRequest extends BaseDto {
    name?: string;
    isDeleted?: boolean;
}

/**
 * DTO директории задачи
 */
export interface TaskDirectoryDto extends BaseSoftDeletableDto {
    name: string;
    artifacts: ArtifactDto[];
}

// Task Evaluation DTOs

/**
 * DTO для создания
 * оценки задачи
 */
export interface CreateTaskEvaluationRequest extends BaseDto {
    activityId: string;
    hours: number;
}

/**
 * DTO для обновления
 * оценки задачи
 */
export interface UpdateTaskEvaluationRequest extends BaseDto {
    activityId: string;
    hours: number;
}

/**
 * DTO оценки задачи
 */
export interface TaskEvaluationDto extends BaseSoftDeletableDto {
    acivityType: BaseConstantDto;
    hours: number;
}

// TodoList DTOs

/**
 * DTO для создания
 * списка подзадач
 */
export interface CreateTaskTodoListRequest extends BaseDto { }

/**
 * DTO для обновления
 * списка подзадач
 */
export interface UpdateTaskTodoListRequest extends BaseDto { }

/**
 * DTO списка подзадач
 */
export interface TaskTodoListDto extends BaseDto {
    items: TaskTodoListItemDto[];
}

/**
 * DTO подзадачи
 */
export interface TaskTodoListItemDto extends BaseSoftDeletableDto {
    name: string;
    duration: number;
    isCompleted: boolean;
    completedAt?: string;
    startedDate: string;
    endDate: string;
}

/**
 * DTO для создания
 * подзадачи
 */
export interface CreateTaskTodoListItemRequest extends BaseDto {
    name: string;
    duration: number;
    startDate: string;
    endDate: string;
}

/**
 * DTO для обновления
 * подзадачи
 */
export interface UpdateTaskTodoListItemRequest extends BaseDto {
    name: string;
    duration: number;
    isCompleted: boolean;
    completedAt?: string;
    startedDate: string;
    endDate?: string;
}

// Project Thread DTOs

/**
 * DTO для создания треда
 * проекта
 */
export interface CreateProjectThreadRequest extends BaseDto {
    title: string;
    text: string;
}

/**
 * DTO для обновления треда
 * проекта
 */
export interface UpdateProjectThreadRequest extends BaseDto {
    title: string;
    text: string;
    isDeleted?: boolean;
}

/**
 * DTO треда проекта
 */
export interface ProjectThreadDto extends BaseSoftDeletableDto {
    userId: string;
    title: string;
    slug: string;
    text: string;
    isArchived: boolean;
    isClosed: boolean;
    comments: ProjectThreadCommentDto[];
}

/**
 * Краткое DTO треда проекта
 */
export interface ShortProjectThreadDto extends BaseSoftDeletableDto {
    userId: string;
    title: string;
    slug: string;
    text: string;
    isArchived: boolean;
    isClosed: boolean;
}

// Project Thread Comment DTOs

/**
 * DTO для создания комментария
 * треда проекта
 */
export interface CreateProjectThreadCommentRequest extends BaseDto {
    text: string;
}

/**
 * DTO для обновления комментария
 * треда проекта
 */
export interface UpdateProjectThreadCommentRequest extends BaseDto {
    text: string;
    isDeleted?: boolean;
}

/**
 * DTO комментария треда проекта
 */
export interface ProjectThreadCommentDto extends BaseSoftDeletableDto {
    userId: string;
    text: string;
}

// Project DTOs

/**
 * DTO для добавления
 * пользователя в проект
 */
export interface AddProjectUserRequest extends BaseDto {
    userId: string;
}

/**
 * DTO для удаления
 * пользователя из проекта
 */
export interface DeleteProjectUserRequest extends BaseDto {
    userId: string;
}

/**
 * DTO с информацией о
 * пользователе проекта
 */
export interface ProjectUserDto {
    userId: string;
    role: ProjectRoleDto;
    user: GrpcUserDto;
}

/**
 * DTO для обновления информации
 * о пользователе проекта
 */
export interface UpdateProjectUserRequest extends BaseDto {
    userId: string;
    roleId: string;
}

// Section DTOs

/**
 * DTO для создания
 * секции
 */
export interface CreateSectionRequest extends BaseDto {
    name: string;
}

/**
 * DTO для обновления
 * секции
 */
export interface UpdateSectionRequest extends BaseDto {
    name: string;
    isDeleted?: boolean;
}

/**
 * DTO секции
 */
export interface SectionDto extends BaseSoftDeletableDto {
    name: string;
    tasks: TaskDto[];
}

// Sprint DTOs

/**
 * DTO для создания
 * спринта
 */
export interface CreateSprintRequest {
    name: string;
}

/**
 * DTO для обновления
 * спринта
 */
export interface UpdateSprintRequest extends BaseDto {
    name: string;
}

/**
 * DTO спринта
 */
export interface SprintDto extends BaseDto {
    name: string;
}