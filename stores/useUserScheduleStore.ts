import { defineStore } from "pinia";
import { userScheduleService } from "~/services/identity/userScheduleServiceFactory";
import type { CreateUserScheduleRequest, UpdateUserScheduleRequest, ListRequest, UserScheduleDto } from "~/types/request.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useUserScheduleStore = defineStore("userSchedule", () => {
    const data = ref<UserScheduleDto[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const errorHandler = useApiErrorHandler();

    const userId = ref<string | null>(null);
    const limit = ref(20);
    const offset = ref(0);
    const includeDeleted = ref(false);
    const totalCount = ref(0);

    async function findByUser() {
        loading.value = true;
        error.value = null;
        try {
            if (!userId.value) {
                throw new Error("User ID is not set");
            }
            const req: ListRequest = {
                limit: limit.value,
                offset: offset.value,
                includeDeleted: includeDeleted.value
            };
            const res = await userScheduleService
                .findByUser(userId.value, req)
                .execute();
            data.value = res.data;
            totalCount.value = res.totalCount;
            return data.value;
        } catch (err) {
            errorHandler.handleError(err);
            return [];
        } finally {
            loading.value = false;
        }
    }

    async function getUserSchedule(id: string) {
        loading.value = true;
        error.value = null;
        try {
            return await userScheduleService.getUserSchedule(id).execute();
        } catch (err) {
            errorHandler.handleError(err);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function createUserSchedule(body: CreateUserScheduleRequest) {
        loading.value = true;
        error.value = null;
        try {
            await userScheduleService.createUserSchedule(body).ensured("Расписание успешно создано!");
            return true;
        } catch (err) {
            errorHandler.handleError(err);
            return false;
        } finally {
            loading.value = false;
        }
    }

    async function updateUserSchedule(body: UpdateUserScheduleRequest) {
        loading.value = true;
        error.value = null;
        try {
            await userScheduleService.updateUserSchedule(body).ensured("Расписание успешно обновлено!");
            return true;
        } catch (err) {
            errorHandler.handleError(err);
            return false;
        } finally {
            loading.value = false;
        }
    }

    async function deleteUserSchedule(id: string) {
        loading.value = true;
        error.value = null;
        try {
            await userScheduleService.deleteUserSchedule(id).ensured("Расписание успешно удалено!");
            return true;
        } catch (err) {
            errorHandler.handleError(err);
            return false;
        } finally {
            loading.value = false;
        }
    }

    async function restoreUserSchedule(id: string) {
        loading.value = true;
        error.value = null;
        try {
            await userScheduleService.restoreUserSchedule(id).ensured("Расписание успешно восстановлено!");
            return true;
        } catch (err) {
            errorHandler.handleError(err);
            return false;
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

    const currentPage = computed(() => offset.value / limit.value + 1);

    watch(() => [offset.value, includeDeleted.value], () => {
        findByUser()
    })

    return {
        data,
        loading,
        currentPage,
        error,
        limit,
        offset,
        totalCount,
        userId,
        findByUser,
        reset,
        nextPage,
        prevPage,
        getUserSchedule,
        createUserSchedule,
        updateUserSchedule,
        deleteUserSchedule,
        restoreUserSchedule,
    };
});
