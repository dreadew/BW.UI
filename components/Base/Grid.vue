<template>
  <div :class="[props.withoutHeading ? 'mt-4' : '']" class="flex flex-col gap-4">
    <UiHeading v-if="!props.withoutHeading" level="4" class="mb-6">
      <slot name="title">Таблица</slot>
    </UiHeading>
    <div class="w-full flex items-center justify-between gap-4 mb-4">
      <div class="w-full flex items-center gap-3">
        <UInput v-model="searchLocal" :placeholder="searchPlaceholder ? searchPlaceholder : 'Введите текст...'"
          class="w-64" />
        <UCheckbox v-if="showIncludeDeleted" v-model="props.store.includeDeleted" label="Показывать удаленные" />
      </div>
      <UButton v-if="!props.isReadonly" color="primary" @click="$emit('create')">Создать</UButton>
    </div>
    <UTable ref="table" sticky :data="filteredData" :loading="props.store.loading" loading-color="primary"
      loading-animation="carousel" :columns="props.columns" v-model:pagination="pagination" :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }" class="max-h-[45vh] overflow-y-auto w-full">
      <template #action-cell="{ row }">
        <div class="flex gap-2 justify-end">
          <UButton v-if="editable && !props.isReadonly" size="xs" variant="subtle" color="primary"
            icon="i-heroicons-pencil" @click="$emit('edit', row.original)" />
          <UButton v-if="!props.isReadonly" size="xs" variant="subtle" color="error" icon="i-heroicons-trash"
            @click="$emit('delete', row.original)" />
        </div>
      </template>
    </UTable>
    <div class="w-full flex justify-center border-t border-default pt-4">
      <UPagination :default-page="props.store.currentPage" :items-per-page="props.store.limit"
        :total="props.store.totalCount" @update:page="(p) => props.store.offset = props.store.limit * (p - 1)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'
import { ref, computed, onMounted } from 'vue'
import type { BaseDataStore } from '~/types/common.types';
import type { BaseDto } from '~/types/request.types'

const props = defineProps<{
  store: BaseDataStore<BaseDto>,
  columns: TableColumn<any>[],
  editable?: boolean,
  searchPlaceholder?: string,
  showIncludeDeleted?: boolean,
  withoutHeading?: boolean,
  customListFn?: () => Promise<void>,
  isReadonly?: boolean
}>()

const table = useTemplateRef('table')
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
})

onMounted(() => {
  if (props.customListFn) {
    props.customListFn()
    return
  }

  props.store.list()
})

defineEmits<{
  (e: 'create'): void
  (e: 'edit', item: BaseDto): void
  (e: 'delete', item: BaseDto): void
}>()

const pagination = ref({
  pageIndex: props.store.offset,
  pageSize: props.store.limit,
  totalCount: props.store.totalCount,
})
</script>
