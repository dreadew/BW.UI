<template>
  <div>
    <UiHeading size="xl" class="mb-6">Задача</UiHeading>
    <UCard v-if="task">
      <UiHeading size="md">{{ task.name }}</UiHeading>
      <UiText color="neutral" class="mt-1">{{ task.priorityType.name }}</UiText>
      <UiText color="neutral" size="xs" class="mt-2">ID: {{ task.id }}</UiText>
      <UiText color="neutral" size="xs" class="mt-2">Описание: {{ task.content }}</UiText>
    </UCard>
    <div class="flex gap-4 mt-6">
      <NuxtLink :to="`/project/${projectId}/tasks/${task?.id}/todo`">
        <UButton size="sm" variant="outline">Подзадачи</UButton>
      </NuxtLink>
      <NuxtLink :to="`/project/${projectId}/tasks/${task?.id}/activity`">
        <UButton size="sm" variant="outline">Активность</UButton>
      </NuxtLink>
      <NuxtLink :to="`/project/${projectId}/tasks/${task?.id}/comments`">
        <UButton size="sm" variant="outline">Комментарии</UButton>
      </NuxtLink>
      <NuxtLink :to="`/project/${projectId}/tasks/${task?.id}/directory`">
        <UButton size="sm" variant="outline">Артефакты</UButton>
      </NuxtLink>
      <NuxtLink :to="`/project/${projectId}/tasks/${task?.id}/evaluation`">
        <UButton size="sm" variant="outline">Оценки</UButton>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '~/stores/useTaskStore'
import type { TaskDto } from '~/types/response.types'
const route = useRoute()
const projectId = route.params.projectId
const taskId = route.params.taskId
const taskStore = useTaskStore()
const task = ref<TaskDto | null>(null)
onMounted(async () => {
  task.value = await taskStore.get(taskId as string)
})
</script>
