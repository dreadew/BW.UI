import { defineStore } from "pinia";
import { userScheduleService } from "~/services/identity/userScheduleServiceFactory";
import type { PagingParams } from "~/types/api.types";
import type { CreateUserScheduleRequest, UpdateUserScheduleRequest, ListRequest } from "~/types/request.types";
import type { UserSchedule } from "~/types/response.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useUserScheduleStore = defineStore("userSchedule", () => {
    const schedules = ref<UserSchedule[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const errorHandler = useApiErrorHandler();

    const limit = ref(20);
    const offset = ref(0);

    async function findByUser(userId: string, params: ListRequest = { limit: limit.value, offset: offset.value, includeDeleted: false }) {
        isLoading.value = true;
        error.value = null;
        try {
            const req: ListRequest = {
                limit: params.limit ?? limit.value,
                offset: params.offset ?? offset.value,
                includeDeleted: params.includeDeleted ?? false
            };
            schedules.value = await userScheduleService.findByUser(userId, req).execute();
            return schedules.value;
        } catch (err) {
            errorHandler.handleError(err);
            return [];
        } finally {
            isLoading.value = false;
        }
    }

    function setPaging(newLimit: number, newOffset: number) {
        limit.value = newLimit;
        offset.value = newOffset;
    }

    function nextPage() {
        offset.value += limit.value;
    }

    function prevPage() {
        offset.value = Math.max(0, offset.value - limit.value);
    }

    async function getUserSchedule(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            return await userScheduleService.getUserSchedule(id).execute();
        } catch (err) {
            errorHandler.handleError(err);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    async function createUserSchedule(body: CreateUserScheduleRequest) {
        isLoading.value = true;
        error.value = null;
        try {
            await userScheduleService.createUserSchedule(body).ensured("Расписание успешно создано!");
            return true;
        } catch (err) {
            errorHandler.handleError(err);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function updateUserSchedule(body: UpdateUserScheduleRequest) {
        isLoading.value = true;
        error.value = null;
        try {
            await userScheduleService.updateUserSchedule(body).ensured("Расписание успешно обновлено!");
            return true;
        } catch (err) {
            errorHandler.handleError(err);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteUserSchedule(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            await userScheduleService.deleteUserSchedule(id).ensured("Расписание успешно удалено!");
            return true;
        } catch (err) {
            errorHandler.handleError(err);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function restoreUserSchedule(id: string) {
        isLoading.value = true;
        error.value = null;
        try {
            await userScheduleService.restoreUserSchedule(id).ensured("Расписание успешно восстановлено!");
            return true;
        } catch (err) {
            errorHandler.handleError(err);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        schedules,
        isLoading,
        error,
        limit,
        offset,
        findByUser,
        setPaging,
        nextPage,
        prevPage,
        getUserSchedule,
        createUserSchedule,
        updateUserSchedule,
        deleteUserSchedule,
        restoreUserSchedule,
    };
});
