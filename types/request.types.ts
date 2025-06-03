import type { NotificationTypes } from "./response.types";

/**
 * @description Запрос на обновление токенов
 */
export interface RenewRequest {
  /**
   * @description Refresh token
   * @minLength 1
   */
  refreshToken: string;
  /**
   * @description Access token
   * @minLength 1
   */
  accessToken: string;
}

/**
 * @description Запрос на отзыв токена
 */
export interface RevokeRequest {
  /**
   * @description Идентификатор токена
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
}

/**
 * @description Запрос на вход
 */
export interface SignInRequest {
  /**
   * @description Имя пользователя
   * @minLength 1
   * @maxLength 24
   * @pattern ^[a-zA-Z0-9._]+$
   */
  username: string;
  /**
   * @description Пароль
   * @minLength 8
   * @maxLength 32
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  password: string;
  /**
   * @description Запомнить меня
   */
  rememberMe: boolean;
}

/**
 * @description Запрос на регистрацию
 */
export interface SignUpRequest {
  /**
   * @description Имя пользователя
   * @minLength 1
   * @maxLength 24
   * @pattern ^[a-zA-Z0-9._]+$
   */
  username: string;
  /**
   * @description Email
   * @format email
   * @maxLength 100
   */
  email: string;
  /**
   * @description Телефон
   * @minLength 12
   * @maxLength 12
   * @pattern ^[+]\d{11}$
   */
  phoneNumber: string;
  /**
   * @description Пароль
   * @minLength 8
   * @maxLength 32
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  password: string;
}

/**
 * @description Запрос на создание навыка
 */
export interface CreateSkillRequest {
  /**
   * @description Название навыка
   * @minLength 2
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  name: string;
}

/**
 * @description Запрос на обновление навыка
 */
export interface UpdateSkillRequest {
  /**
   * @description Идентификатор навыка
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Название навыка
   * @minLength 2
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  name: string;
  /**
   * @description Признак удаления
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на роль
 */
export interface RoleRequest {
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Идентификатор роли
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  roleId: string;
}

/**
 * @description Запрос на навык
 */
export interface SkillRequest {
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Идентификатор навыка
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  skillId: string;
}

/**
 * @description Запрос на обновление пользователя
 */
export interface UpdateUserRequest {
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Email
   * @format email
   * @maxLength 100
   * @optional
   */
  email?: string;
  /**
   * @description Телефон
   * @minLength 12
   * @maxLength 12
   * @pattern ^[+]\d{11}$
   * @optional
   */
  phoneNumber?: string;
  /**
   * @description Пароль
   * @minLength 8
   * @maxLength 32
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   * @optional
   */
  password?: string;
  /**
   * @description Признак удаления
   * @optional
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на верификацию пользователя
 */
export interface VerifyUserRequest {
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Код подтверждения
   * @minLength 6
   * @maxLength 6
   * @pattern ^\d{6}$
   */
  code: string;
  /**
   * @description Тип уведомления
   */
  type: NotificationTypes;
}

/**
 * @description Запрос на восстановление пароля
 */
export interface RecoverPasswordRequest {
  /**
   * @description Идентификатор
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Новый пароль
   * @minLength 8
   * @maxLength 32
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  password: string;
  /**
   * @description Код подтверждения
   * @minLength 6
   * @maxLength 6
   * @pattern ^\d{6}$
   */
  verificationCode: string;
}

/**
 * @description Запрос на создание пользовательской роли
 */
export interface CreateUserRoleRequest {
  /**
   * @description Название роли
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z ]+$
   */
  name: string;
}

/**
 * @description Запрос на обновление пользовательской роли
 */
export interface UpdateUserRoleRequest {
  /**
   * @description Идентификатор роли
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Название роли
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z ]+$
   * @optional
   */
  name?: string;
  /**
   * @description Признак удаления
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на создание claim для роли
 */
export interface CreateUserRoleClaimsRequest {
  /**
   * @description Идентификатор роли
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  roleId: string;
  /**
   * @description Тип claim
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z.]+$
   */
  claimType: string;
  /**
   * @description Значение claim
   * @minLength 1
   * @maxLength 256
   * @pattern ^[a-zA-Z.]+$
   */
  claimValue: string;
}

/**
 * @description Запрос на обновление claim для роли
 */
export interface UpdateUserRoleClaimsRequest {
  /**
   * @description Тип claim
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z.]+$
   */
  claimType: string;
  /**
   * @description Значение claim
   * @minLength 1
   * @maxLength 256
   * @pattern ^[a-zA-Z.]+$
   */
  claimValue: string;
}

/**
 * @description Запрос на создание расписания пользователя
 */
export interface CreateUserScheduleRequest {
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  userId: string;
  /**
   * @description Дата
   * @minLength 1
   */
  date: string;
  /**
   * @description Время начала
   * @minLength 1
   */
  startAt: string;
  /**
   * @description Время окончания
   * @minLength 1
   */
  endAt: string;
}

/**
 * @description Запрос на обновление расписания пользователя
 */
export interface UpdateUserScheduleRequest {
  /**
   * @description Идентификатор расписания
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Дата
   * @optional
   */
  date?: string;
  /**
   * @description Время начала
   * @optional
   */
  startAt?: string;
  /**
   * @description Время окончания
   * @optional
   */
  endAt?: string;
}

/**
 * @description Запрос на создание проекта
 */
export interface CreateProjectRequest {
  /**
   * @description Идентификатор рабочей области
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  workspaceId: string;
  /**
   * @description Название проекта
   * @minLength 3
   * @pattern ^[a-zA-Z ]+$
   */
  name: string;
}

/**
 * @description Запрос на обновление проекта
 */
export interface UpdateProjectRequest {
  /**
   * @description Идентификатор проекта
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  projectId: string;
  /**
   * @description Название проекта
   * @minLength 4
   * @pattern ^[a-zA-Z ]+$
   */
  name: string;
  /**
   * @description Признак удаления
   * @optional
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на удаление проекта
 */
export interface DeleteProjectRequest extends Record<string, unknown> {
  /**
   * @description Идентификатор проекта
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  projectId: string;
}

/**
 * @description Запрос на восстановление проекта
 */
export interface RestoreProjectRequest {
  /**
   * @description Идентификатор проекта
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  projectId: string;
}

/**
 * @description Запрос на добавление пользователя
 */
export interface AddUserRequest {
  /**
   * @description Идентификатор
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  userId: string;
}

/**
 * @description Запрос на удаление пользователя
 */
export interface DeleteUserRequest extends Record<string, unknown> {
  /**
   * @description Идентификатор
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4]-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4]-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  userId: string;
}

/**
 * @description Запрос на создание роли проекта
 */
export interface CreateProjectRoleRequest {
  /**
   * @description Название роли
   * @minLength 3
   * @pattern ^[a-zA-Z0-9]+$
   */
  name: string;
  /**
   * @description Идентификатор проекта
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  projectId: string;
}

/**
 * @description Запрос на обновление роли проекта
 */
export interface UpdateProjectRoleRequest {
  /**
   * @description Идентификатор роли
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Название роли
   * @minLength 3
   * @pattern ^[a-zA-Z0-9]+$
   */
  name: string;
}

/**
 * @description Запрос на создание claim для роли проекта
 */
export interface CreateProjectRoleClaimsRequest {
  /**
   * @description Значение claim
   * @minLength 3
   * @pattern ^[a-zA-Z.]+$
   */
  value: string;
  /**
   * @description Идентификатор роли
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  roleId: string;
}

/**
 * @description Запрос на обновление claim для роли проекта
 */
export interface UpdateProjectRoleClaimsRequest {
  /**
   * @description Идентификатор claim
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Значение claim
   * @minLength 3
   * @pattern ^[a-zA-Z.]+$
   */
  value: string;
}

/**
 * @description Запрос на создание треда проекта
 */
export interface CreateProjectThreadRequest {
  /**
   * @description Идентификатор проекта
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  projectId: string;
  /**
   * @description Идентификатор автора
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  fromId: string;
  /**
   * @description Заголовок
   * @minLength 3
   * @pattern ^[a-zA-Z ]+$
   */
  title: string;
  /**
   * @description Текст
   * @minLength 3
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  text: string;
}

/**
 * @description Запрос на обновление треда проекта
 */
export interface UpdateProjectThreadRequest {
  /**
   * @description Идентификатор треда
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Идентификатор автора
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4]-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  fromId: string;
  /**
   * @description Заголовок
   * @minLength 3
   * @pattern ^[a-zA-Z ]+$
   */
  title: string;
  /**
   * @description Текст
   * @minLength 3
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  text: string;
  /**
   * @description Признак удаления
   * @optional
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на создание комментария к треду проекта
 */
export interface CreateProjectThreadCommentRequest {
  /**
   * @description Идентификатор треда
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  threadId: string;
  /**
   * @description Идентификатор автора
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  fromId: string;
  /**
   * @description Текст комментария
   * @minLength 3
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  text: string;
}

/**
 * @description Запрос на обновление комментария к треду проекта
 */
export interface UpdateProjectThreadCommentRequest {
  /**
   * @description Идентификатор комментария
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  threadCommentId: string;
  /**
   * @description Текст комментария
   * @minLength 3
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   * @optional
   */
  text?: string;
  /**
   * @description Признак удаления
   * @optional
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на создание секции
 */
export interface CreateSectionRequest {
  /**
   * @description Идентификатор проекта
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  projectId: string;
  /**
   * @description Название секции
   * @minLength 3
   * @pattern ^[a-zA-Z ]+$
   */
  name: string;
}

/**
 * @description Запрос на обновление секции
 */
export interface UpdateSectionRequest {
  /**
   * @description Идентификатор секции
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  sectionId: string;
  /**
   * @description Название секции
   * @minLength 3
   * @pattern ^[a-zA-Z ]+$
   * @optional
   */
  name?: string;
  /**
   * @description Признак удаления
   * @optional
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на создание задачи
 */
export interface CreateTaskRequest {
  /**
   * @description Название задачи
   * @minLength 3
   * @pattern ^[a-zA-Z ]+$
   */
  name: string;
  /**
   * @description Архивирована ли задача
   */
  isArchived: boolean;
  /**
   * @description Дата начала
   * @optional
   */
  startedDate?: string;
  /**
   * @description Дата окончания
   * @optional
   */
  endDate?: string;
  /**
   * @description Тип приоритета
   * @optional
   */
  priorityTypeId?: string;
  /**
   * @description Тип активности
   * @optional
   */
  activityTypeId?: string;
  /**
   * @description Тип отношения
   * @optional
   */
  relationTypeId?: string;
}

/**
 * @description Запрос на обновление задачи
 */
export interface UpdateTaskRequest {
  /**
   * @description Идентификатор задачи
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Название задачи
   * @minLength 3
   * @pattern ^[a-zA-Z ]+$
   */
  name: string;
  /**
   * @description Архивирована ли задача
   */
  isArchived: boolean;
  /**
   * @description Признак удаления
   * @optional
   */
  isDeleted?: boolean;
  /**
   * @description Дата начала
   * @optional
   */
  startedDate?: string;
  /**
   * @description Дата окончания
   * @optional
   */
  endDate?: string;
}

/**
 * @description Запрос на добавление исполнителя задачи
 */
export interface AddTaskAssigneeRequest {
  /**
   * @description Идентификатор задачи
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  taskId: string;
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  userId: string;
}

/**
 * @description Запрос на удаление исполнителя задачи
 */
export interface RemoveTaskAssigneeRequest {
  /**
   * @description Идентификатор задачи
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4]-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  taskId: string;
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4]-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  userId: string;
}

/**
 * @description Запрос на создание активности задачи
 */
export interface CreateTaskActivityRequest {
  /**
   * @description Идентификатор проекта
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  projectId: string;
  /**
   * @description Идентификатор задачи
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  taskId: string;
  /**
   * @description Идентификатор активности
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  activityId: string;
  /**
   * @description Дата
   */
  date: string;
  /**
   * @description Часы работы
   * @minimum 0
   */
  workHours: number;
}

/**
 * @description Запрос на обновление активности задачи
 */
export interface UpdateTaskActivityRequest {
  /**
   * @description Идентификатор активности задачи
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  taskActivityId: string;
  /**
   * @description Идентификатор задачи
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  taskId: string;
  /**
   * @description Идентификатор активности
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4]-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  activityId: string;
  /**
   * @description Часы работы
   */
  workHours: number;
}

/**
 * @description Запрос на создание комментария к задаче
 */
export interface CreateTaskCommentRequest {
  /**
   * @description Идентификатор задачи
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  taskId: string;
  /**
   * @description Текст комментария
   * @minLength 1
   */
  content: string;
}

/**
 * @description Запрос на обновление комментария к задаче
 */
export interface UpdateTaskCommentRequest {
  /**
   * @description Идентификатор комментария
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Текст комментария
   * @optional
   */
  content?: string;
}

/**
 * @description Запрос на создание директории задачи
 */
export interface CreateTaskDirectoryRequest {
  /**
   * @description Идентификатор задачи
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  taskId: string;
  /**
   * @description Название директории
   * @pattern ^[a-zA-Z.]+$
   */
  name: string;
}

/**
 * @description Запрос на обновление директории задачи
 */
export interface UpdateTaskDirectoryRequest {
  /**
   * @description Идентификатор директории
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Название директории
   * @pattern ^[a-zA-Z.]+$
   * @optional
   */
  name?: string;
  /**
   * @description Признак удаления
   * @optional
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на создание оценки задачи
 */
export interface CreateTaskEvaluationRequest {
  /**
   * @description Идентификатор задачи
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  taskId: string;
  /**
   * @description Идентификатор активности
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  activityId: string;
  /**
   * @description Часы
   * @minimum 0
   */
  hours: number;
}

/**
 * @description Запрос на обновление оценки задачи
 */
export interface UpdateTaskEvaluationRequest {
  /**
   * @description Идентификатор оценки
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  evaluationId: string;
  /**
   * @description Идентификатор активности
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4]-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  activityId: string;
  /**
   * @description Часы
   * @minimum 0
   */
  hours: number;
}

/**
 * @description Запрос на создание списка дел задачи
 */
export interface CreateTaskTodoListRequest {
  /**
   * @description Идентификатор задачи
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  taskId: string;
}

/**
 * @description Запрос на обновление списка дел задачи
 */
export interface UpdateTaskTodoListRequest {
  /**
   * @description Идентификатор списка дел
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Признак удаления
   * @optional
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на создание элемента списка дел задачи
 */
export interface CreateTaskTodoListItemRequest {
  /**
   * @description Идентификатор списка дел задачи
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  taskTodoListId: string;
  /**
   * @description Название
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  name: string;
  /**
   * @description Длительность
   */
  duration: number;
  /**
   * @description Дата начала
   * @minLength 1
   */
  startedDate: string;
  /**
   * @description Дата окончания
   */
  endDate?: string;
}

/**
 * @description Запрос на обновление элемента списка дел задачи
 */
export interface UpdateTaskTodoListItemRequest {
  /**
   * @description Идентификатор элемента списка дел
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Название
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  name: string;
  /**
   * @description Длительность
   */
  duration: number;
  /**
   * @description Признак завершенности
   */
  isCompleted: boolean;
  /**
   * @description Дата завершения
   */
  completedAt?: string;
  /**
   * @description Дата начала
   * @optional
   */
  startedDate: string;
  /**
   * @description Дата окончания
   * @optional
   */
  endDate?: string;
}

/**
 * @description Запрос на создание рабочего пространства
 */
export interface CreateWorkspaceRequest {
  /**
   * @description Название рабочего пространства
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  name: string;
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  userId: string;
}

/**
 * @description Запрос на обновление рабочего пространства
 */
export interface UpdateWorkspaceRequest {
  /**
   * @description Идентификатор рабочего пространства
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Название рабочего пространства
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  name: string;
  /**
   * @description Признак удаления
   * @optional
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на создание директории рабочего пространства
 */
export interface CreateWorkspaceDirectoryRequest {
  /**
   * @description Идентификатор рабочего пространства
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  workspaceId: string;
  /**
   * @description Название директории
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  name: string;
}

/**
 * @description Запрос на обновление позиции рабочего пространства
 */
export interface UpdateWorkspacePositionRequest {
  /**
   * @description Идентификатор должности
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Идентификатор рабочего пространства
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  workspaceId: string;
  /**
   * @description Название
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  name: string;
  /**
   * @description Признак удаления
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на создание роли рабочего пространства
 */
export interface CreateWorkspaceRoleRequest {
  /**
   * @description Идентификатор рабочего пространства
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  workspaceId: string;
  /**
   * @description Название роли
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z ]+$
   */
  name: string;
}

/**
 * @description Запрос на обновление роли рабочего пространства
 */
export interface UpdateWorkspaceRoleRequest {
  /**
   * @description Идентификатор роли
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Название роли
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z ]+$
   */
  name: string;
  /**
   * @description Признак удаления
   * @optional
   */
  isDeleted?: boolean;
}

/**
 * @description Запрос на создание claim для роли рабочего пространства
 */
export interface CreateWorkspaceRoleClaimRequest {
  /**
   * @description Идентификатор роли
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  roleId: string;
  /**
   * @description Значение claim
   * @minLength 1
   * @maxLength 256
   * @pattern ^[a-zA-Z.]+$
   */
  value: string;
}

/**
 * @description Запрос на обновление claim для роли рабочего пространства
 */
export interface UpdateWorkspaceRoleClaimRequest {
  /**
   * @description Идентификатор клейма
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Значение claim
   * @minLength 1
   * @maxLength 256
   * @pattern ^[a-zA-Z.]+$
   */
  value: string;
}

/**
 * @description Запрос на приглашение пользователя в рабочее пространство
 */
export interface InviteWorkspaceUserRequest extends Record<string, unknown> {
  /**
   * @description Идентификатор рабочего пространства
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  userId: string;
  /**
   * @description эл. почта
   */
  email: string;
}

/**
 * @description Запрос на обновление пользователя в рабочем пространстве
 */
export interface UpdateWorkspaceUserRequest {
  /**
   * @description Идентификатор рабочего пространства
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  workspaceId: string;
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  userId: string;
  /**
   * @description Идентификатор роли
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   * @optional
   */
  roleId?: string;
  /**
   * @description Идентификатор позиции
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4]-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   * @optional
   */
  positionId?: string;
}

/**
 * @description Запрос на удаление пользователя из рабочего пространства
 */
export interface DeleteWorkspaceUserRequest extends Record<string, unknown> {
  /**
   * @description Идентификатор пользователя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4]-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  userId: string;
  /**
   * @description Идентификатор рабочего пространства
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4]-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  workspaceId: string;
}

/**
 * @description Запрос на удаление файла
 */
export interface DeleteFileRequest extends Record<string, unknown> {
  /**
   * @description Идентификатор файла
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Идентификатор отправителя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  fromId: string;
}

/**
 * @description Запрос на загрузку файла
 */
export interface UploadFileRequest {
  /**
   * @description Идентификатор отправителя
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  fromId: string;
  /**
   * @description Содержимое
   */
  content: number[];
  /**
   * @description Имя файла
   * @minLength 1
   * @maxLength 256
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.? ]+$
   */
  fileName: string;
  /**
   * @description Тип содержимого
   * @minLength 1
   * @maxLength 128
   * @pattern ^[a-zA-Z0-9/]+$
   */
  contentType: string;
}

/**
 * @description Запрос на создание должности
 */
export interface CreateWorkspacePositionRequest {
  /**
   * @description Значение name
   * @minLength 1
   * @maxLength 64
   * @pattern ^[a-zA-Z ]+$
   */
  name: string;
  /**
   * @description Идентификатор рабочего пространства
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  workspaceId: string;
}

/**
 * @description Запрос на обновление директории рабочего пространства
 */
export interface UpdateWorkspaceDirectoryRequest {
  /**
   * @description Идентификатор директории
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @description Значение name
   * @minLength 1
   * @maxLength 64
   * @pattern ^[a-zA-Z ]+$
   */
  name: string;
}

/**
 * @description Запрос на генерацию кода подтверждения
 */
export interface GenerateVerificationCodeRequest {
  /**
   * @description Email
   * @format email
   * @maxLength 100
   */
  email: string;
  type: NotificationTypes;
}

/**
 * @description Запрос отзыв сессии
 */
export interface RevokeRequest {
  /**
   * @description Идентификатор директории
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
}

/**
 * @description Запрос на обновление сессии
 */
export interface RenewRequest {
  accessToken: string;
  refreshToken: string;
}