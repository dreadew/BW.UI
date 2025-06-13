import { defineStore } from "pinia";
import type { GenerateVerificationCodeRequest, RecoverPasswordRequest, SignInRequest, SignUpRequest, SkillRequest, UpdateUserRequest, RoleRequest, UserDto, VerifyRequest } from '~/types/request.types';
import * as signalR from "@microsoft/signalr";
import { NotificationLevel, type WebNotificationDto } from "../types/api.types";
import { userServiceFactory } from "~/services/identity/userServiceFactory";
import { signInRequestSchema, signUpRequestSchema } from "~/schemas/generated.schema";
import { authServiceFactory } from "~/services/identity/authServiceFactory";
import { validate } from "~/utils/validation.utils";

export const useUserStore = defineStore("user", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();

  const user = ref<UserDto | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const validationErrors = ref<Record<string, string>>({});

  const data = ref<UserDto[]>([]);
  const totalCount = ref(0);
  const offset = ref(0);
  const limit = ref(20);
  const includeDeleted = ref(false);

  const accessToken = ref(tokenManager.getAccessToken());
  const refreshToken = ref(tokenManager.getRefreshToken());
  const storedUserId = ref(tokenManager.getUserId());

  const connection: Ref<signalR.HubConnection | null> = ref(null);
  const suppressDefault = ref(false);

  const isAuthenticated = computed(() => {
    return !!accessToken.value && !!storedUserId.value;
  });

  const userFullName = computed(() => {
    if (!user.value) return "";
    return `${user.value.username}`.trim();
  });

  const userId = computed(() => user.value?.id ?? storedUserId.value ?? tokenManager.getUserId());

  function resetState() {
    loading.value = false;
    error.value = null;
    validationErrors.value = {};
  }

  async function logout() {
    resetState();
    suppressDefault.value = true;
    user.value = null;
    tokenManager.clearTokens();
    accessToken.value = "";
    refreshToken.value = "";
    storedUserId.value = "";
    await connection.value?.stop();

    toast.add({
      title: 'Успех!',
      description: 'Вы успешно вышли из аккаунта',
      color: 'success'
    });
  }

  async function fetchCurrentUser() {
    if (!accessToken.value) {
      user.value = null;
      return;
    }

    if (!storedUserId.value) {
      tokenManager.clearTokens();
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      user.value = await userServiceFactory
        .getUser(storedUserId.value)
        .execute();
    } catch (err) {
      errorHandler.handleError(err);
      user.value = null;
      tokenManager.clearTokens();
    } finally {
      loading.value = false;
    }
  }

  watchEffect(() => {
    if (suppressDefault.value) {
      suppressDefault.value = false;
      return;
    }

    if (accessToken.value && !user.value) {
      fetchCurrentUser();
    }

    if (accessToken.value && !connection.value) {
      connect();
    }

    if (!accessToken.value && user.value) {
      logout();
    }
  });

  async function login(credentials: SignInRequest) {
    resetState();
    loading.value = true;

    const { isValid, errors } = await validate(signInRequestSchema, credentials);

    if (!isValid) {
      validationErrors.value = errors || {};
      loading.value = false;
      return false;
    }

    try {
      var res = await authServiceFactory
        .login(credentials)
        .ensured("Вы успешно вошли в аккаунт!");

      accessToken.value = tokenManager.getAccessToken() ?? res?.accessToken;
      refreshToken.value = tokenManager.getRefreshToken() ?? res?.refreshToken;
      storedUserId.value = tokenManager.getUserId() ?? res?.userId;

      await fetchCurrentUser();

      await connect();

      return true;
    } finally {
      loading.value = false;
    }
  }

  async function connect() {
    const config = useRuntimeConfig();

    if (connection.value) return;

    if (!accessToken.value) return;

    connection.value = new signalR.HubConnectionBuilder()
      .withUrl(config.public.identityApiUrl + "/hubs/notification", {
        accessTokenFactory: () => `Bearer ${accessToken.value!}`,
        withCredentials: true,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.value.on(
      "ReceiveNotification",
      (message: WebNotificationDto) => {
        switch (message.level) {
          case NotificationLevel.Success:
            toast.add({ title: message.message, color: 'primary' });
            break;
          case NotificationLevel.Info:
            toast.add({ title: message.message, color: 'primary' });
            break;
          case NotificationLevel.Warning:
            toast.add({ title: message.message, color: 'warning' });
            break;
          case NotificationLevel.Error:
            toast.add({ title: message.message, color: 'error' });
            break;
        }
      }
    );

    await connection.value.start();
  }

  async function register(userData: SignUpRequest) {
    resetState();
    loading.value = true;

    /*const { isValid, errors } = await validate(signUpRequestSchema, userData);

    if (!isValid) {
      validationErrors.value = errors || {};
      loading.value = false;
      return false;
    }*/

    try {
      await authServiceFactory
        .register(userData)
        .ensured(
          "Регистрация прошла успешно! Теперь вы можете войти в свой аккаунт."
        );
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(id: string, dto: UpdateUserRequest) {
    resetState();
    loading.value = true;

    try {
      await userServiceFactory
        .updateUser(id, dto)
        .ensured("Вы успешно обновили аккаунт");
      await fetchCurrentUser();
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function uploadProfilePhoto(id: string, file: File) {
    resetState();
    loading.value = true;

    try {
      await userServiceFactory
        .uploadPhoto(id, file)
        .ensured("Вы успешно обновили фото профиля!");
      await fetchCurrentUser();
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProfilePhoto(id: string) {
    resetState();
    loading.value = true;

    try {
      await userServiceFactory
        .deletePhoto(id)
        .ensured("Вы успешно удалили фото профиля!");
      await fetchCurrentUser();
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function generateVerificationCode(
    body: GenerateVerificationCodeRequest
  ) {
    loading.value = true;

    try {
      await userServiceFactory
        .generateVerificationCode(body)
        .ensured("Код подтверждения успешно отправлен на ваш email!");
    } finally {
      loading.value = false;
    }
  }

  async function verify(
    body: VerifyRequest 
  ) {
    loading.value = true;

    try {
      await userServiceFactory
        .verify(body)
        .ensured("Аккаунт успешно подтвержден");
    } finally {
      loading.value = false;
    }
  }

  async function recoverPassword(id: string, body: RecoverPasswordRequest) {
    loading.value = true;

    try {
      await userServiceFactory
        .recoverPassword({ ...body, id })
        .ensured("Вы успешно изменили пароль!");
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function deleteUser() {
    loading.value = true;

    try {
      await userServiceFactory
        .deleteUser(user.value?.id!)
        .ensured("Вы успешно удалили аккаунт!");
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function restoreUser() {
    loading.value = true;

    try {
      await userServiceFactory
        .restoreUser(user.value?.id!)
        .ensured("Вы успешно восстановили аккаунт!");
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function addSkill(dto: SkillRequest) {
    loading.value = true;

    try {
      await userServiceFactory
        .addSkill(dto)
        .ensured("Вы успешно добавили навык!");
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function removeSkill(dto: SkillRequest) {
    loading.value = true;

    try {
      await userServiceFactory
        .removeSkill(dto)
        .ensured("Вы успешно удалили навык!");
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function addRole(dto: RoleRequest) {
    loading.value = true;
    try {
      await userServiceFactory
        .addRole(dto)
        .ensured("Роль успешно добавлена!");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function removeRole(dto: RoleRequest) {
    loading.value = true;
    try {
      await userServiceFactory
        .removeRole(dto)
        .ensured("Роль успешно удалена!");
      return true;
    } catch (err) {
      errorHandler.handleError(err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function list() {
    loading.value = true;
    try {
      const res = await userServiceFactory
        .listUsers({limit: limit.value, offset: offset.value, includeDeleted: includeDeleted.value})
        .execute()
      data.value = res.data;
      totalCount.value = res.totalCount;
      return res;
    } catch (err) {
      errorHandler.handleError(err);
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function reset() {
    offset.value = 0;
    limit.value = 20;
    totalCount.value = 0;
    data.value = [];
  }

  const prevPage = () => {
    const newOffset = offset.value - limit.value;
    if (newOffset < 0) {
      offset.value = 0;
      return;
    }
    offset.value = newOffset;
  }

  const nextPage = () => {
    const newOffset = offset.value + limit.value;
    if (newOffset >= totalCount.value) {
      return;
    }
    offset.value = newOffset;
  }

  async function ensureUserLoaded() {
    if (!user.value && (accessToken.value && (storedUserId.value || tokenManager.getUserId()))) {
      await fetchCurrentUser();
    }
  }

  return {
    user,
    userId,
    loading,
    error,
    validationErrors,
    isAuthenticated,
    userFullName,
    login,
    logout,
    register,
    fetchCurrentUser,
    ensureUserLoaded,
    updateProfile,
    uploadProfilePhoto,
    list,
    generateVerificationCode,
    verify,
    recoverPassword,
    deleteProfilePhoto,
    deleteUser,
    restoreUser,
    addSkill,
    removeSkill,
    addRole,
    removeRole,
    resetState,
    data,
    offset,
    limit,
    totalCount,
    prevPage,
    nextPage
  };
});