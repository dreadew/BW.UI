<template>
    <div class="mt-8 pt-8 border-t border-t-muted">
        <UiHeading size="lg" class="mb-8">Комментарии</UiHeading>
        <div class="max-h-[60vh] overflow-y-scroll flex flex-col flex-wrap gap-4 p-2">
            <USkeleton v-if="props.store.loading" class="h-36 w-full" />
            <UCard v-if="!props.store.loading && props.store.data.length === 0"
                class="w-full flex flex-col items-center justify-center p-8">
                <UIcon name="i-lucide-message-square" class="text-4xl text-primary mb-2" />
                <UiHeading size="lg">Нет комментариев</UiHeading>
                <UiText color="neutral" class="mt-2">Добавьте первый комментарий в данный раздел!</UiText>
            </UCard>
            <UCard v-for="comment in props.store.data" :key="comment.id"
                class="mb-2 flex justify-between items-start gap-3">
                <div class="space-y-4">
                    <UiHeading level="4">{{ comment?.text }}</UiHeading>
                    <UiText color="neutral" size="sm" class="mt-1">Автор: `{{ comment?.user?.username }} | {{
                        DateUtils.deserialize(comment.createdAt)?.toLocaleString('ru-RU', {
                            day: '2-digit', month:
                                '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })
                    }}``</UiText>
                </div>
                <div class="mt-4 flex gap-1">
                    <UTooltip text="Редактировать">
                        <UButton size="xs" icon="i-heroicons-pencil" variant="subtle"
                            @click="$emit('openEdit', comment)" />
                    </UTooltip>
                    <UTooltip text="Удалить">
                        <UButton size="xs" color="error" icon="i-heroicons-trash" variant="subtle"
                            @click="$emit('openDelete', comment)" />
                    </UTooltip>
                </div>
            </UCard>
        </div>
        <UForm class="flex items-end mt-4 gap-2" :state="addCommentState"
            @submit="$emit('createComment', addCommentState)">
            <UFormField class="flex-1" name="text" required>
                <UInput v-model="addCommentState.text" placeholder="Добавить комментарий..." class="w-full" />
            </UFormField>
            <UButton type="submit" color="primary" :loading="formLoading">Отправить</UButton>
        </UForm>
    </div>

    <div class="w-full flex justify-center pt-4">
        <UPagination :default-page="props.store.currentPage" :items-per-page="props.store.limit"
            :total="props.store.totalCount" @update:page="(p) => props.store.offset = props.store.limit * (p - 1)" />
    </div>
</template>

<script setup lang="ts">
import { DateUtils } from '~/utils/date.utils';
import type { BaseDataStore } from '~/types/common.types';
import type { ProjectThreadCommentDto } from '~/types/request.types';

const props = defineProps<{
    id: string;
    store: BaseDataStore<ProjectThreadCommentDto>;
    formLoading?: boolean;
}>();

const addCommentState = ref({ id: props.id, text: '' })

defineEmits(['createComment', 'openEdit', 'openDelete'])
</script>