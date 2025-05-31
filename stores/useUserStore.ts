import { defineStore } from "pinia";
import type {
  GenerateVerificationCodeRequest,
  RecoverPasswordRequest,
  SignInRequest,
  SignUpRequest,
  SkillRequest,
  UpdateUserRequest
} from '~/types/request.types';
import * as signalR from "@microsoft/signalr";
import { NotificationLevel, type WebNotificationDto } from "../types/api.types";
import type { User } from "~/types/response.types";
import { userServiceFactory } from "~/services/identity/userServiceFactory";
import { signInRequestSchema, signUpRequestSchema } from "~/schemas/generated.schema";
import { authServiceFactory } from "~/services/identity/authServiceFactory";

export const useUserStore = defineStore("user", () => {
  const toast = useToast();
  const errorHandler = useApiErrorHandler();
  //const { validate } = useValidation();

  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const validationErrors = ref<Record<string, string>>({});

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

  function resetState() {
    isLoading.value = false;
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

    isLoading.value = true;
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
      isLoading.value = false;
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
    isLoading.value = true;

    //const { isValid, errors } = await validate(signInRequestSchema, credentials);

    //if (!isValid) {
    //validationErrors.value = errors || {};
    //isLoading.value = false;
    //return false;
    //}

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
      isLoading.value = false;
    }
  }

  async function connect() {
    if (connection.value) return;

    if (!accessToken.value) return;

    connection.value = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000" + "/hubs/notification", {
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
    isLoading.value = true;

    /*const { isValid, errors } = await validate(signUpRequestSchema, userData);

    if (!isValid) {
      validationErrors.value = errors || {};
      isLoading.value = false;
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
      isLoading.value = false;
    }
  }

  async function updateProfile(id: string, dto: UpdateUserRequest) {
    resetState();
    isLoading.value = true;

    try {
      await userServiceFactory
        .updateUser(id, dto)
        .ensured("Вы успешно обновили аккаунт");
      await fetchCurrentUser();
      return true;
    } finally {
      isLoading.value = false;
    }
  }

  async function uploadProfilePhoto(id: string, file: File) {
    resetState();
    isLoading.value = true;

    try {
      await userServiceFactory
        .uploadPhoto(id, file)
        .ensured("Вы успешно обновили фото профиля!");
      await fetchCurrentUser();
      return true;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteProfilePhoto(id: string) {
    resetState();
    isLoading.value = true;

    try {
      await userServiceFactory
        .deletePhoto(id)
        .ensured("Вы успешно удалили фото профиля!");
      await fetchCurrentUser();
      return true;
    } finally {
      isLoading.value = false;
    }
  }

  async function generateVerificationCode(
    body: GenerateVerificationCodeRequest
  ) {
    isLoading.value = true;

    try {
      await userServiceFactory
        .generateVerificationCode(body)
        .ensured("Код подтверждения успешно отправлен на ваш email!");
    } finally {
      isLoading.value = false;
    }
  }

  async function recoverPassword(id: string, body: RecoverPasswordRequest) {
    isLoading.value = true;

    try {
      await userServiceFactory
        .recoverPassword(id, body)
        .ensured("Вы успешно изменили пароль!");
      return true;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteUser() {
    isLoading.value = true;

    try {
      await userServiceFactory
        .deleteUser(user.value?.id!)
        .ensured("Вы успешно удалили аккаунт!");
      return true;
    } finally {
      isLoading.value = false;
    }
  }

  async function restoreUser() {
    isLoading.value = true;

    try {
      await userServiceFactory
        .restoreUser(user.value?.id!)
        .ensured("Вы успешно восстановили аккаунт!");
      return true;
    } finally {
      isLoading.value = false;
    }
  }

  async function addSkill(dto: SkillRequest) {
    isLoading.value = true;

    try {
      await userServiceFactory
        .addSkill(user.value?.id!, dto)
        .ensured("Вы успешно добавили навык!");
      return true;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeSkill(dto: SkillRequest) {
    isLoading.value = true;

    try {
      await userServiceFactory
        .removeSkill(user.value?.id!, dto)
        .ensured("Вы успешно удалили навык!");
      return true;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    user,
    isLoading,
    error,
    validationErrors,
    isAuthenticated,
    userFullName,
    login,
    logout,
    register,
    fetchCurrentUser,
    updateProfile,
    uploadProfilePhoto,
    generateVerificationCode,
    recoverPassword,
    deleteProfilePhoto,
    deleteUser,
    restoreUser,
    addSkill,
    removeSkill,
    resetState,
  };
});