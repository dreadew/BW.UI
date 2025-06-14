<template>
  <div>
    <UiHeading size="xl" class="mb-6">Задача</UiHeading>
    <USkeleton v-if="!task" class="h-58 w-full mb-6" />
    <UCard v-if="task" variant="subtle" class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <UiText color="neutral" class="mt-1">ID: {{ task.id }}</UiText>
          <UiHeading level="4">{{ task.name }}</UiHeading>
          <UiText color="neutral" class="mt-2">{{ task.content }}</UiText>
          <div class="mt-4 flex flex-col gap-1">
            <UiText color="neutral" size="sm">Автор: {{ task.author?.user?.username || task.author?.user?.email }}
            </UiText>
            <UiText v-if="task.analytic" color="neutral" size="sm">Аналитик: {{ task.analytic?.user?.username ||
              task.analytic.user?.email }}</UiText>
          </div>
        </div>
        <UBadge :color="priorityColor(task.priorityType?.name)" variant="soft" class="ml-4">
          {{ priorityLabel(task.priorityType?.name) }}
        </UBadge>
      </div>
      <div v-if="task.relations?.length" class="mt-4">
        <UiHeading size="sm" class="mb-2">Связи задачи</UiHeading>
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="rel in task.relations" :key="rel.id" color="primary" variant="outline">
            {{ rel.relationTypeId || 'Связь' }}: {{ rel.relatedTaskId }}
          </UBadge>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <UButton size="sm" color="secondary" icon="i-heroicons-eye" variant="subtle">
          Отчет
        </UButton>
        <UButton size="sm" color="primary" icon="i-heroicons-document-text" variant="subtle"
          @click="openEditModal = true">
          Редактировать</UButton>
        <UButton size="sm" color="error" icon="i-heroicons-trash" variant="subtle" @click="openDeleteModal = true">
          Удалить</UButton>
      </div>
    </UCard>
    <ProjectTaskEditModal :open="openEditModal" :loading="formLoading" :task="editTaskState!"
      @update:open="openEditModal = $event" @submit="onSubmitEdit" />
    <ProjectTaskDeleteModal :open="openDeleteModal" :loading="formLoading" :task="task!"
      @update:open="openDeleteModal = $event" @confirm="confirmDelete" />

    <UTabs :model-value="tab" @update:model-value="tab = String($event)" :items="tabs" class="mb-8 mt-4">
      <template #subtasks>
        <TaskTodoList />
      </template>
      <template #activity>
        <TaskActivities />
      </template>
      <template #evaluation>
        <TaskEvaluations />
      </template>
      <template #artifacts>
        <TaskArtifacts />
      </template>
      <template #assignees>
        <TaskAssignees />
      </template>
    </UTabs>

    <BaseCommentLayout :store="commentStore" :id="taskId" :form-loading="commentStore.loading"
      @createComment="onSubmitComment" @openEdit="onEditComment" @openDelete="onDeleteComment" />

    <UModal :open="openCommentEditModal" @update:open="openCommentEditModal = $event" title="Редактировать комментарий">
      <template #body>
        <UForm class="space-y-4" :state="editFormState" @submit="onSubmitEditComment">
          <UFormField label="Текст" name="text" required>
            <UInput v-model="editFormState.text" required placeholder="Текст комментария" class="w-full" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="formLoading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal :open="openCommentDeleteModal" @update:open="openCommentDeleteModal = $event" title="Удалить комментарий?">
      <template #body>
        <UiText>Вы уверены, что хотите удалить комментарий?</UiText>
      </template>
      <template #footer>
        <div class="w-full flex justify-end gap-2">
          <UButton variant="ghost" color="neutral" @click="openCommentDeleteModal = false">Отмена</UButton>
          <UButton color="error" @click="confirmDeleteComment" :loading="formLoading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '~/stores/useTaskStore'
import { useTaskActivityStore } from '~/stores/useTaskActivityStore'
import { useTaskEvaluationStore } from '~/stores/useTaskEvaluationStore'
import { useTaskDirectoryStore } from '~/stores/useTaskDirectoryStore'
import { useTaskCommentStore } from '~/stores/useTaskCommentStore'
import type { UpdateTaskRequest, TaskDto, TaskCommentDto, UpdateTaskCommentRequest, CreateTaskCommentRequest } from '~/types/request.types'

definePageMeta({
  layout: 'project',
  title: 'Задача',
})
const route = useRoute()
const router = useRouter()
const projectId = computed(() => route.params.projectId as string)
const taskId = computed(() => route.params.taskId as string)
const taskStore = useTaskStore()
const activityStore = useTaskActivityStore()
const evaluationStore = useTaskEvaluationStore()
const directoryStore = useTaskDirectoryStore()
const commentStore = useTaskCommentStore()
evaluationStore.taskId = taskId.value;
activityStore.taskId = taskId.value;
directoryStore.taskId = taskId.value;
commentStore.taskId = taskId.value;

const task = ref<TaskDto | null>(null)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const openCommentEditModal = ref(false)
const openCommentDeleteModal = ref(false)
const formLoading = ref(false)
const editTaskState = ref<UpdateTaskRequest | null>(null)
const tab = ref('subtasks')
const tabs = [
  { label: 'Подзадачи', value: 'subtasks', slot: 'subtasks' },
  { label: 'Активности', value: 'activity', slot: 'activity' },
  { label: 'Оценки', value: 'evaluation', slot: 'evaluation' },
  { label: 'Артефакты', value: 'artifacts', slot: 'artifacts' },
  { label: 'Исполнители', value: 'assignees', slot: 'assignees' },
]
const selectedComment = ref<TaskCommentDto | null>(null)
const editFormState = ref<UpdateTaskCommentRequest>({ id: '', text: '' })

onMounted(async () => {
  const result = await taskStore.get(taskId.value)
  task.value = result ? { ...result } : null
  await commentStore.list()
})

const onSubmitComment = async (comment: CreateTaskCommentRequest) => {
  if (!comment?.text) return
  formLoading.value = true
  await commentStore.create({ id: taskId.value, text: comment.text })
  await commentStore.list()
  comment.text = ''
  formLoading.value = false
}

function onEditComment(comment: TaskCommentDto) {
  selectedComment.value = comment
  editFormState.value = { id: comment.id, text: comment.text }
  openCommentEditModal.value = true
}

async function onSubmitEditComment() {
  if (!selectedComment.value) return
  formLoading.value = true
  await commentStore.update({ id: selectedComment.value.id, text: editFormState.value.text })
  openCommentEditModal.value = false
  formLoading.value = false
  await commentStore.list()
}

function onDeleteComment(comment: TaskCommentDto) {
  selectedComment.value = comment
  openCommentDeleteModal.value = true
}

async function confirmDeleteComment() {
  if (!selectedComment.value) return
  formLoading.value = true
  await commentStore.deleteComment(selectedComment.value.id)
  openCommentDeleteModal.value = false
  formLoading.value = false
  await commentStore.list()
}

function onSubmitEdit(data: UpdateTaskRequest) {
  formLoading.value = true
  taskStore.updateTask(data).then(async () => {
    openEditModal.value = false
    formLoading.value = false
    const result = await taskStore.get(taskId.value)
    task.value = result ? { ...result } : null
  })
}

function confirmDelete() {
  if (!task.value) return
  formLoading.value = true
  taskStore.deleteTask(task.value.id).then(() => {
    openDeleteModal.value = false
    formLoading.value = false
    router.push(`/project/${projectId}`)
  })
}

watch(openEditModal, (open) => {
  if (open && task.value) {
    editTaskState.value = {
      id: task.value.id,
      name: task.value.name,
      content: task.value.content ?? '',
      priorityTypeId: task.value.priorityType?.id ?? '',
      sectionId: task.value.sectionId ?? '',
      startedDate: task.value.startedDate ?? '',
      endDate: task.value.endDate ?? ''
    }
  }
})
</script>
