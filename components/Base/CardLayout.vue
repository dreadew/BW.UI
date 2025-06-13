<template>
    <UiHeading size="2xl" class="mb-6">{{ title }}</UiHeading>
    <div class="flex items-center justify-between gap-4 mb-4">
        <UButton color="primary" @click="$emit('openCreate')">Создать</UButton>
        <div class="flex items-center gap-3">
            <UCheckbox v-model="props.store.includeDeleted" label="Показывать удаленные" />
            <UInput v-model="searchLocal" placeholder="Поиск по значению..." class="w-64" />
        </div>
    </div>

    <div v-if="props.store.loading" class="flex justify-center items-center">
        <USkeleton class="w-full h-96 mt-2" />
    </div>

    <BaseEmpty v-if="!props.store.loading && filteredData?.length === 0" />

    <div v-if="!props.store.loading && filteredData?.length > 0"
        class="max-h-[60vh] overflow-y-scroll flex items-center flex-wrap gap-6 p-2">
        <BaseCard v-for="item in filteredData" :key="item.id" :entity="item" :title="item.name" :image="item.path"
            :date="DateUtils.deserialize(item.createdAt)?.toLocaleDateString()">
            <template #actions>
                <div class="flex items-center gap-2">
                    <UButton size="sm" variant="ghost" color="primary" @click="$emit('openEdit', item)"
                        icon="i-heroicons-pencil" />
                    <UButton v-if="!item.isDeleted" size="sm" variant="ghost" color="error"
                        @click="$emit('openDelete', item)" icon="i-heroicons-trash" />
                    <UButton v-if="item.isDeleted" size="sm" variant="ghost" color="secondary"
                        @click="$emit('openRestore', item)" icon="i-heroicons-arrow-up-circle" />
                </div>
                <NuxtLink :to="`/${props.type}/${item.id}`">
                    <UButton size="sm" color="primary">Перейти</UButton>
                </NuxtLink>
            </template>
        </BaseCard>
    </div>

    <div class="w-full flex justify-center pt-4">
        <UPagination :default-page="props.store.currentPage.value" :items-per-page="props.store.limit"
            :total="props.store.totalCount" @update:page="(p) => props.store.offset = props.store.limit * (p - 1)" />
    </div>
</template>

<script setup lang="ts">
import type { BaseDataStore } from '~/types/common.types';
import type { BaseSoftDeletableDtoWithName } from '~/types/request.types';

const props = defineProps<{
    store: BaseDataStore<BaseSoftDeletableDtoWithName & { path: string; }>;
    type: string;
    title: string;
}>();

const searchLocal = ref('')

const filteredData = computed(() => {
    const arr = props.store?.data ?? []
    if (searchLocal.value) {
        return arr.filter((item: any) =>
            Object.values(item).some(
                v => typeof v === 'string' && v.toLowerCase().includes(searchLocal.value.toLowerCase())
            )
        )
    }
    return arr
});

defineEmits(['openCreate', 'openEdit', 'openDelete', 'openRestore'])
</script>