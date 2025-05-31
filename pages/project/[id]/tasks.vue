<template>
  <div>
    <UiHeading size="xl" class="mb-6">Задачи проекта</UiHeading>
    <UButton color="primary" @click="openCreateModal = true" class="mb-4">Создать задачу</UButton>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="task in tasks" :key="task.id">
        <NuxtLink :to="`/project/${projectId}/tasks/${task.id}`">
          <UiHeading size="md">{{ task.title }}</UiHeading>
          <UiText class="text-gray-500 mt-1">{{ task.status }}</UiText>
        </NuxtLink>
      </UCard>
    </div>
    <!-- Модальное окно для создания задачи -->
    <ProjectTaskCreateModal :open="openCreateModal" @update:open="openCreateModal = $event" @submit="onCreateTask" :loading="formLoading" />
    <ProjectTaskDeleteModal :open="openDeleteModal" :task="taskToDelete" @update:open="openDeleteModal = $event" @confirm="confirmDelete" :loading="formLoading" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '~/stores/useTaskStore'
const route = useRoute()
const projectId = route.params.id
const taskStore = useTaskStore()
const tasks = ref([])
onMounted(async () => {
  tasks.value = await taskStore.listByProject(projectId)
})
const openCreateModal = ref(false)
const openDeleteModal = ref(false)
const taskToDelete = ref(null)
const formLoading = ref(false)
const onCreateTask = async (taskData) => {
  formLoading.value = true
  try {
    await taskStore.createTask({ ...taskData, projectId })
    tasks.value = await taskStore.listByProject(projectId)
    openCreateModal.value = false
  } catch (error) {
    console.error('Ошибка при создании задачи:', error)
  } finally {
    formLoading.value = false
  }
}
const confirmDelete = async () => {
  if (!taskToDelete.value) return
  formLoading.value = true
  try {
    await taskStore.deleteTask(taskToDelete.value.id)
    tasks.value = tasks.value.filter(task => task.id !== taskToDelete.value.id)
    openDeleteModal.value = false
    taskToDelete.value = null
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error)
  } finally {
    formLoading.value = false
  }
}
</script>
