<template>
  <div>
    <UiHeading size="xl" class="mb-6">Задача</UiHeading>
    <UCard v-if="task">
      <UiHeading size="md">{{ task.title }}</UiHeading>
      <UiText class="text-gray-500 mt-1">{{ task.status }}</UiText>
      <UiText class="text-xs text-gray-400 mt-2">ID: {{ task.id }}</UiText>
      <UiText class="text-xs text-gray-400 mt-2">Описание: {{ task.description }}</UiText>
    </UCard>
    <div class="flex gap-4 mt-6">
      <NuxtLink :to="`/project/${projectId}/tasks/${task.id}/todo`">
        <UButton size="sm" variant="outline">Подзадачи</UButton>
      </NuxtLink>
      <NuxtLink :to="`/project/${projectId}/tasks/${task.id}/activity`">
        <UButton size="sm" variant="outline">Активность</UButton>
      </NuxtLink>
      <NuxtLink :to="`/project/${projectId}/tasks/${task.id}/comments`">
        <UButton size="sm" variant="outline">Комментарии</UButton>
      </NuxtLink>
      <NuxtLink :to="`/project/${projectId}/tasks/${task.id}/directory`">
        <UButton size="sm" variant="outline">Артефакты</UButton>
      </NuxtLink>
      <NuxtLink :to="`/project/${projectId}/tasks/${task.id}/evaluation`">
        <UButton size="sm" variant="outline">Оценки</UButton>
      </NuxtLink>
    </div>
    <!-- Здесь будут todo, activity, comments, evaluation, directory -->
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '~/stores/useTaskStore'
const route = useRoute()
const taskId = route.params.taskId
const taskStore = useTaskStore()
const task = ref(null)
onMounted(async () => {
  task.value = await taskStore.getById(taskId)
})
</script>
