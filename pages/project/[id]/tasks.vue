<template>
  <div>
    <UiHeading size="xl" class="mb-6">Задачи проекта</UiHeading>
    <UButton color="primary" @click="openCreateModal = true" class="mb-4">Создать задачу</UButton>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="task in tasks" :key="task.id">
        <NuxtLink :to="`/project/${projectId}/tasks/${task.id}`">
          <UiHeading size="md">{{ task.name }}</UiHeading>
        </NuxtLink>
      </UCard>
    </div>
    <div class="flex gap-2 mt-4">
      <UButton size="xs" :disabled="offset === 0" @click="prevPage">Назад</UButton>
      <UButton size="xs" :disabled="tasks.length < limit" @click="nextPage">Вперёд</UButton>
    </div>
    <ProjectTaskCreateModal :open="openCreateModal" @update:open="openCreateModal = $event" @submit="onCreateTask" :loading="formLoading" :state="formState" />
    <ProjectTaskDeleteModal v-if="taskToDelete" :open="openDeleteModal" :task="taskToDelete" @update:open="openDeleteModal = $event" @confirm="confirmDelete" :loading="formLoading" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '~/stores/useTaskStore'
import type { TaskDto } from '~/types/response.types'
definePageMeta({ layout: 'project' })
useHead({ title: 'Задачи проекта' })
const route = useRoute()
const projectId = route.params.id
const taskStore = useTaskStore()
const tasks = ref<TaskDto[]>([])
const limit = ref(20)
const offset = ref(0)
onMounted(async () => {
  tasks.value = await taskStore.listByProject(projectId as string) ?? [];
})
async function fetchTasks() {
  tasks.value = await taskStore.listByProject(projectId as string, { limit: limit.value, offset: offset.value }) ?? []
}
function nextPage() {
  offset.value += limit.value
  fetchTasks()
}
function prevPage() {
  offset.value = Math.max(0, offset.value - limit.value)
  fetchTasks()
}
watch([limit, offset], fetchTasks, { immediate: true })
const openCreateModal = ref(false)
const openDeleteModal = ref(false)
const taskToDelete = ref<TaskDto | null>(null)
const formLoading = ref(false)
const formState = ref({
  name: '',
  startedDate: '',
  endDate: ''
})
const onCreateTask = async () => {
  formLoading.value = true
  await taskStore.createTask({
    name: formState.value.name,
    isArchived: false,
    startedDate: formState.value.startedDate,
    endDate: formState.value.endDate
  })
  openCreateModal.value = false
  formLoading.value = false
}
const confirmDelete = async () => {
  if (!taskToDelete.value) return;
  formLoading.value = true;
  try {
    await taskStore.deleteTask(taskToDelete.value.id)
    tasks.value = tasks.value.filter(task => task.id !== taskToDelete.value?.id)
    openDeleteModal.value = false
    taskToDelete.value = null
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error)
  } finally {
    formLoading.value = false
  }
}
</script>
