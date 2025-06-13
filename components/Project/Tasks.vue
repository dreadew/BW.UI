<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <UiHeading size="md">Задачи проекта</UiHeading>
      <UButton color="primary" icon="i-heroicons-plus" @click="openCreateModal = true" variant="solid" />
    </div>
    <div v-if="taskStore.loading" class="flex justify-center items-center">
      <USkeleton class="w-full h-96 mt-2" />
    </div>
    <div v-else>
      <div v-if="tasks.length === 0" class="flex justify-center items-center min-h-[120px]">
        <UiText color="neutral">Нет задач</UiText>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectTaskCard v-for="task in taskStore.data" :key="task.id" :task="task" :section-id="task.sectionId"
          @edit="onEdit" @delete="onDelete" />
      </div>
    </div>
    <ProjectTaskCreateModal :open="openCreateModal" :section-id="sectionOptions[0]?.value || ''" :id="projectId"
      :loading="formLoading" @update:open="openCreateModal = $event" @submit="onSubmitCreate" />
    <ProjectTaskEditModal :open="openEditModal" :loading="formLoading" :task="editTaskState!"
      @update:open="openEditModal = $event" @submit="onSubmitEdit" />
    <UModal :open="openDeleteModal" @update:open="openDeleteModal = $event" title="Удалить задачу?">
      <template #body>
        <UiText color="darker-neutral">
          Вы уверены, что хотите удалить задачу <b>{{ deleteTaskState?.name }}</b>?
        </UiText>
      </template>
      <template #footer>
        <div class="w-full flex gap-2 justify-end">
          <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена</UButton>
          <UButton type="button" color="error" variant="solid" @click="confirmDelete" :loading="formLoading">Удалить
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '~/stores/useTaskStore'
import { useSectionStore } from '~/stores/useSectionStore'
import type { ShortTaskDto, UpdateTaskRequest, CreateTaskRequest } from '~/types/request.types'

const props = defineProps<{ projectId?: string, isActive?: boolean }>()
const route = useRoute()
const projectId = computed(() => props.projectId || (route.params.id as string))
const taskStore = useTaskStore()
const sectionStore = useSectionStore()
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const formLoading = ref(false)
const editTaskState = ref<UpdateTaskRequest | null>(null)
const deleteTaskState = ref<ShortTaskDto | null>(null)
const tasks = computed(() => taskStore.data.map(task => ({
  id: task.id,
  name: task.name,
  sectionId: task.sectionId ?? '',
  content: task.content,
  priorityType: task.priorityType,
  analytic: task.analytic,
  author: task.author,
  assignees: task.assignees,
  startedDate: task.startedDate,
  endDate: task.endDate
})) as ShortTaskDto[])
const sectionOptions = computed(() => sectionStore.data.map(s => ({ value: s.id, label: s.name })))

function onEdit(task: ShortTaskDto) {
  editTaskState.value = {
    id: task.id,
    name: task.name,
    content: task.content ?? '',
    priorityTypeId: task.priorityType?.id ?? '',
    sectionId: task.sectionId ?? '',
    startedDate: task.startedDate ?? '',
    endDate: task.endDate ?? ''
  }
  openEditModal.value = true
}
function onDelete(task: ShortTaskDto) {
  deleteTaskState.value = task
  openDeleteModal.value = true
}

async function onSubmitCreate(data: CreateTaskRequest) {
  formLoading.value = true
  await taskStore.createTask(data)
  openCreateModal.value = false
  formLoading.value = false
  await fetchTasks()
}
async function onSubmitEdit(data: UpdateTaskRequest) {
  formLoading.value = true
  await taskStore.updateTask(data)
  openEditModal.value = false
  formLoading.value = false
  await fetchTasks()
}
async function confirmDelete() {
  if (!deleteTaskState.value) return
  formLoading.value = true
  await taskStore.deleteTask(deleteTaskState.value.id)
  openDeleteModal.value = false
  formLoading.value = false
  await fetchTasks()
}

async function fetchTasks() {
  await taskStore.listByProject()
  await sectionStore.listByProject()
}

// onMounted(fetchTasks)
watch([projectId], fetchTasks, { immediate: true })
</script>
