<template>
  <div class="kanban-column rounded-xl shadow p-4 flex flex-col min-h-[400px] bg-white dark:bg-gray-900">
    <div class="flex items-center justify-between mb-2">
      <UiHeading level="6">{{ section.name }}</UiHeading>
      <div class="flex gap-2">
        <UButton size="xs" color="secondary" icon="i-heroicons-pencil" variant="subtle" @click="$emit('edit', section)" />
        <UButton size="xs" color="error" icon="i-heroicons-trash" variant="subtle" @click="$emit('delete', section)" />
      </div>
    </div>
    <div class="flex-1 flex flex-col gap-2">
      <div v-for="task in section.tasks" :key="task.id" class="kanban-task bg-blue-50 dark:bg-blue-900 rounded p-2 cursor-pointer">
        <div class="font-medium">{{ task.name }}</div>
        <div class="text-xs text-gray-500">{{ task.content }}</div>
      </div>
    </div>
    <UButton size="xs" color="primary" icon="i-heroicons-plus" class="mt-2" variant="solid" @click="$emit('add-task', section)">Добавить задачу</UButton>
  </div>
</template>
<script setup lang="ts">
import type { SectionDto } from '~/types/request.types'
defineProps<{ section: SectionDto }>()
</script>
