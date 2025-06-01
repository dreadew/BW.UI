<template>
  <div>
    <UiHeading size="lg" class="mb-4">Подзадачи (Todo)</UiHeading>
    <UButton color="primary" @click="openCreateModal = true" class="mb-4">Добавить список подзадач</UButton>
    <div v-if="todoLists.length === 0" class="text-gray-500">Нет списков подзадач</div>
    <div v-else>
      <UCard v-for="todoList in todoLists" :key="todoList.id" class="mb-4">
        <UiText class="font-bold">{{ 'Список подзадач' }}</UiText>
        <div class="mt-2">
          <div v-if="todoList.items && todoList.items.length > 0">
            <div class="font-semibold mb-1">Элементы:</div>
            <div class="flex flex-col gap-2">
              <UCard v-for="item in todoList.items" :key="item.id" class="p-2 flex items-center gap-2">
                <span>{{ item.name }}</span>
                <span class="text-xs text-gray-400 ml-2">Статус: {{ item.isCompleted ? 'Выполнено' : 'В процессе' }}</span>
                <UButton size="xs" color="error" variant="soft" @click="openDeleteModalFor(item)">Удалить</UButton>
              </UCard>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400">Нет подзадач</div>
        </div>
      </UCard>
    </div>
    <UModal v-model:open="openCreateModal" title="Добавить список подзадач">
      <template #body>
        <UForm :state="formState" :schema="formSchema" @submit="onSubmitTodoList">
          <UFormField label="Название" name="title" required>
            <UInput v-model="formState.title" required placeholder="Название списка" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openDeleteModal" title="Удалить подзадачу?">
      <template #body>
        <UiText>Вы уверены, что хотите удалить подзадачу <b>{{ selectedItem?.name }}</b>?</UiText>
        <div class="flex justify-end gap-2 mt-4">
          <UButton @click="openDeleteModal = false">Отмена</UButton>
          <UButton color="error" @click="onDeleteTodo" :loading="loading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskTodoListStore } from '~/stores/useTaskTodoListStore'
import type { TaskTodoListDto, TaskTodoListItemDto } from '~/types/response.types'
useHead({ title: 'Подзадачи задачи' })

const route = useRoute()
const taskId = route.params.taskId as string
const todoStore = useTaskTodoListStore()
const todoLists = ref<TaskTodoListDto[]>([])
const loading = ref(false)

const openCreateModal = ref(false)
const openDeleteModal = ref(false)
const formState = ref({ title: '' })
const formSchema = {
  title: {
    type: 'string',
    required: true,
    minLength: 1
  }
}
const selectedItem = ref<TaskTodoListItemDto | null>(null)

const fetchTodoLists = async () => {
  todoLists.value = await todoStore.list(taskId) ?? []
}

onMounted(fetchTodoLists)

const onSubmitTodoList = async () => {
  loading.value = true
  try {
    await todoStore.createTodoList({ ...formState.value, taskId })
    await fetchTodoLists()
    openCreateModal.value = false
    formState.value = { title: '' }
  } finally {
    loading.value = false
  }
}

function openDeleteModalFor(item: TaskTodoListItemDto) {
  selectedItem.value = item
  openDeleteModal.value = true
}

const onDeleteTodo = async () => {
  if (!selectedItem.value) return
  loading.value = true
  try {
    await todoStore.deleteTodoListItem(selectedItem.value.id)
    await fetchTodoLists()
    openDeleteModal.value = false
    selectedItem.value = null
  } finally {
    loading.value = false
  }
}
</script>
