<template>
  <div>
    <UiHeading size="lg" class="mb-4">Подзадачи (Todo)</UiHeading>
    <UButton color="primary" @click="openCreateModal = true" class="mb-4">Добавить подзадачу</UButton>
    <UCard v-for="todo in todos" :key="todo.id" class="mb-2">
      <UiText>{{ todo.title }}</UiText>
      <UiText class="text-xs text-gray-400 mt-1">Статус: {{ todo.status }}</UiText>
    </UCard>
    <!-- Модальное окно для создания подзадачи -->
    <UModal v-model:open="openCreateModal" title="Добавить подзадачу">
      <template #body>
        <UForm :state="formState" :schema="formSchema" @submit="onSubmitTodo">
          <UFormField label="Название" name="title" required>
            <UInput v-model="formState.title" required placeholder="Название подзадачи" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openDeleteModal" title="Удалить подзадачу?">
      <template #body>
        <UiText>Вы уверены, что хотите удалить подзадачу?</UiText>
        <div class="flex justify-end gap-2 mt-4">
          <UButton @click="openDeleteModal = false">Отмена</UButton>
          <UButton color="danger" @click="onDeleteTodo" :loading="loading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskTodoListStore } from '~/stores/useTaskTodoListStore'
const route = useRoute()
const taskId = route.params.taskId
const todoStore = useTaskTodoListStore()
const todos = ref([])
onMounted(async () => {
  todos.value = await todoStore.listByTask(taskId)
})
const openCreateModal = ref(false)
const openDeleteModal = ref(false)
const formState = ref({
  title: ''
})
const formSchema = {
  title: {
    type: 'string',
    required: true,
    minLength: 1
  }
}
const loading = ref(false)
const onSubmitTodo = async () => {
  loading.value = true
  try {
    await todoStore.create({ ...formState.value, taskId })
    todos.value = await todoStore.listByTask(taskId)
    openCreateModal.value = false
  } finally {
    loading.value = false
  }
}
const onDeleteTodo = async (todoId) => {
  loading.value = true
  try {
    await todoStore.delete(todoId)
    todos.value = await todoStore.listByTask(taskId)
    openDeleteModal.value = false
  } finally {
    loading.value = false
  }
}
</script>
