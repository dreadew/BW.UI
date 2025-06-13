import { defineStore } from "pinia";
import { sessionServiceFactory } from "~/services/identity/sessionServiceFactory";
import type { ListRequest, RevokeRequest, RenewRequest, SessionDto, AccessTokenResponse } from "~/types/request.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useSessionStore = defineStore("session", () => {
    const data = ref<SessionDto[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const errorHandler = useApiErrorHandler();

    const limit = ref(20);
    const offset = ref(0);
    const includeDeleted = ref(false);
    const totalCount = ref(0);

    async function list() {
        loading.value = true;
        error.value = null;
        try {
            const req: ListRequest = {
                limit: limit.value,
                offset: offset.value,
                includeDeleted: includeDeleted.value
            };
            const res = await sessionServiceFactory.list(req).execute();
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

    async function revoke(body: RevokeRequest) {
        loading.value = true;
        error.value = null;
        try {
            await sessionServiceFactory.revoke(body).ensured("Сессия успешно завершена!");
            return true;
        } catch (err) {
            errorHandler.handleError(err);
            return false;
        } finally {
            loading.value = false;
        }
    }

    async function renew(body: RenewRequest): Promise<AccessTokenResponse | null> {
        loading.value = true;
        error.value = null;
        try {
            return await sessionServiceFactory.renew(body).execute();
        } catch (err) {
            errorHandler.handleError(err);
            return null;
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
        list()
    })

    return {
        data,
        loading,
        currentPage,
        error,
        limit,
        offset,
        includeDeleted,
        totalCount,
        list,
        reset,
        nextPage,
        prevPage,
        revoke,
        renew,
    };
});
