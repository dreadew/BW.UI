<template>
  <div class="task-card rounded-xl shadow p-6 mb-6 bg-white dark:bg-gray-900">
    <div class="flex items-center justify-between mb-2">
      <UiHeading level="6">{{ task.name }}</UiHeading>
      <div class="flex gap-2">
        <UButton size="xs" color="secondary" icon="i-heroicons-pencil" variant="subtle" @click="$emit('edit', task)" />
        <UButton size="xs" color="error" icon="i-heroicons-trash" variant="subtle" @click="$emit('delete', task)" />
      </div>
    </div>
    <div class="text-gray-600 mb-2">{{ task.content }}</div>
    <div class="flex flex-wrap gap-2 mb-2">
      <span v-if="task.priorityType" class="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">{{ task.priorityType.name }}</span>
      <span v-if="task.startedDate" class="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium">
        <UIcon name="i-heroicons-play" class="w-4 h-4 mr-1" />Старт: {{ task.startedDate }}
      </span>
      <span v-if="task.endDate" class="inline-flex items-center px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium">
        <UIcon name="i-heroicons-flag" class="w-4 h-4 mr-1" />Дедлайн: {{ task.endDate }}
      </span>
    </div>
    <div class="mb-2">
      <div class="font-medium mb-1">Директории и файлы:</div>
      <div v-for="dir in task.directories" :key="dir.id" class="mb-2">
        <div class="font-semibold text-blue-700 flex items-center">
          <UIcon name="i-heroicons-folder" class="w-4 h-4 mr-1" />{{ dir.name }}
          <UButton size="xs" color="primary" icon="i-heroicons-arrow-up-tray" class="ml-2" variant="subtle" @click="$emit('upload-file', dir)" />
        </div>
        <ul class="ml-4">
          <li v-for="file in dir.artifacts" :key="file.id" class="flex items-center gap-2">
            <UIcon name="i-heroicons-document" class="w-4 h-4 text-gray-500" />
            <span>{{ file.name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="mb-2">
      <div class="font-medium mb-1">Оценки задачи:</div>
      <div v-for="evalItem in task.evaluations" :key="evalItem.id" class="flex items-center gap-2 mb-1">
        <span>{{ evalItem.acivityType?.name || 'Оценка' }}: <b>{{ evalItem.hours }}</b> ч.</span>
        <UButton size="xs" color="secondary" icon="i-heroicons-pencil" variant="subtle" @click="$emit('edit-eval', evalItem)" />
        <UButton size="xs" color="error" icon="i-heroicons-trash" variant="subtle" @click="$emit('delete-eval', evalItem)" />
      </div>
      <UButton size="xs" color="primary" icon="i-heroicons-plus" variant="subtle" @click="$emit('add-eval', task)">Добавить оценку</UButton>
    </div>
    <div class="mb-2">
      <div class="font-medium mb-1">Комментарии:</div>
      <div v-for="comment in task.comments" :key="comment.id" class="flex items-center gap-2 mb-1">
        <span>{{ comment.content }}</span>
        <UButton size="xs" color="secondary" icon="i-heroicons-pencil" variant="subtle" @click="$emit('edit-comment', comment)" />
        <UButton size="xs" color="error" icon="i-heroicons-trash" variant="subtle" @click="$emit('delete-comment', comment)" />
      </div>
      <UButton size="xs" color="primary" icon="i-heroicons-plus" variant="subtle" @click="$emit('add-comment', task)">Добавить комментарий</UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TaskDto } from '~/types/request.types'
defineProps<{ task: TaskDto }>()
</script>
