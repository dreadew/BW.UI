<template>
  <div :class="[props.withoutHeading ? 'mt-4' : '']">
    <UiHeading v-if="!props.withoutHeading" level="4" class="mb-6">
      <slot name="title">Таблица</slot>
    </UiHeading>
    <div class="flex items-center justify-between gap-4 mb-4">
      <UInput v-if="!props.withoutSearch" v-model="searchLocal" placeholder="Поиск пользователя..." class="w-full" />
      <UButton color="primary" @click="$emit('create')">Добавить</UButton>
    </div>
    <UTable :data="filteredUsers" :columns="props.columns" class="w-full">
      <template #action-cell="{ row }">
        <div class="flex gap-2 justify-end">
          <UButton v-if="!props.withoutEditing" size="xs" variant="subtle" color="primary" icon="i-heroicons-pencil"
            @click="$emit('edit', row.original)" />
          <UButton size="xs" variant="subtle" color="error" icon="i-heroicons-trash"
            @click="$emit('delete', row.original)" />
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { ref } from 'vue'
import type { BaseDto } from '~/types/request.types'

const props = defineProps<{
  data: BaseDto[],
  columns: TableColumn<BaseDto, unknown>[],
  withoutHeading?: boolean
  withoutEditing?: boolean
  withoutSearch?: boolean
}>()

const searchLocal = ref('')

const filteredUsers = computed(() => {
  if (!searchLocal.value) return props.data
  const q = searchLocal.value.toLowerCase()
  return props.data.filter(u =>
    (u.user?.username?.toLowerCase().includes(q) || '') ||
    (u.user?.email?.toLowerCase().includes(q) || '') ||
    (u.role?.name?.toLowerCase().includes(q) || '') ||
    (u.position?.name?.toLowerCase().includes(q) || '')
  )
})
</script>
