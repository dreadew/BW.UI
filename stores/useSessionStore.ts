import { defineStore } from "pinia";
import { sessionServiceFactory } from "~/services/identity/sessionServiceFactory";
import type { PagingParams } from "~/types/api.types";
import type { RevokeRequest, RenewRequest } from "~/types/request.types";
import type { Session } from "~/types/response.types";
import type { AccessTokenResponse } from "~/types/response.types";
import { useApiErrorHandler } from "~/utils/errorHandler.utils";

export const useSessionStore = defineStore("session", () => {
    const sessions = ref<Session[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const errorHandler = useApiErrorHandler();

    const limit = ref(20);
    const offset = ref(0);

    async function list(params: PagingParams = {}) {
        isLoading.value = true;
        error.value = null;
        const paging: PagingParams = {
            limit: params.limit ?? limit.value,
            offset: params.offset ?? offset.value,
            ...params
        };
        try {
            sessions.value = await sessionServiceFactory.list(paging).execute();
            return sessions.value;
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

    async function revoke(body: RevokeRequest) {
        isLoading.value = true;
        error.value = null;
        try {
            await sessionServiceFactory.revoke(body).ensured("Сессия успешно завершена!");
            return true;
        } catch (err) {
            errorHandler.handleError(err);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    async function renew(body: RenewRequest): Promise<AccessTokenResponse | null> {
        isLoading.value = true;
        error.value = null;
        try {
            return await sessionServiceFactory.renew(body).execute();
        } catch (err) {
            errorHandler.handleError(err);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        sessions,
        isLoading,
        error,
        limit,
        offset,
        list,
        setPaging,
        nextPage,
        prevPage,
        revoke,
        renew,
    };
});
