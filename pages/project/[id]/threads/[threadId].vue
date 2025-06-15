<template>
  <div>
    <USkeleton v-if="threadStore.loading" class="h-32" />
    <div v-else-if="thread" class="flex items-center justify-between mb-2">
      <div class="space-y-4">
        <div class="space-y-2">
          <UBadge v-if="thread.isClosed" color="error" variant="soft">Закрыт</UBadge>
          <UBadge v-else-if="thread.isArchived" color="warning" variant="soft">В архиве</UBadge>
          <UBadge v-else-if="thread.isDeleted" color="neutral" variant="soft">Удалён</UBadge>
          <UiHeading level="2">{{ thread.title }}</UiHeading>
        </div>
        <UiText size="xl">{{ thread.text }}</UiText>
        <UiText color="neutral" size="xs" class="mt-2">Создано: {{
          DateUtils.deserialize(thread.createdAt)?.toLocaleDateString() }}</UiText>
      </div>
      <div class="flex gap-1">
        <UTooltip text="Редактировать тред">
          <UButton size="xs" icon="i-heroicons-pencil" variant="subtle" @click="openEditThreadModal = true" />
        </UTooltip>
        <UTooltip text="Архивировать тред">
          <UButton size="xs" icon="i-lucide-archive" variant="subtle" @click="onArchiveThread"
            :disabled="thread.isArchived" />
        </UTooltip>
        <UTooltip text="Закрыть тред">
          <UButton size="xs" icon="i-lucide-lock" variant="subtle" @click="onCloseThread" :disabled="thread.isClosed" />
        </UTooltip>
        <UTooltip text="Удалить тред">
          <UButton size="xs" color="error" icon="i-heroicons-trash" variant="subtle"
            @click="openDeleteThreadModal = true" />
        </UTooltip>
      </div>
    </div>

    <BaseCommentLayout :store="commentStore" :id="threadId" :form-loading="formLoading" @createComment="onSubmitComment"
      @openEdit="onEditComment" @openDelete="onDeleteComment" />

    <UModal :open="openEditModal" @update:open="openEditModal = $event" title="Редактировать комментарий">
      <template #body>
        <UForm class="space-y-4" :state="editFormState" @submit="onSubmitEditComment">
          <UFormField label="Текст" name="text" required>
            <UInput v-model="editFormState.text" required placeholder="Текст комментария" class="w-full" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="formLoading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal :open="openDeleteModal" @update:open="openDeleteModal = $event" title="Удалить комментарий?">
      <template #body>
        <UiText>Вы уверены, что хотите удалить комментарий?</UiText>
        <div class="flex justify-end gap-2 mt-4">
          <UButton @click="openDeleteModal = false">Отмена</UButton>
          <UButton color="error" @click="confirmDeleteComment" :loading="formLoading">Удалить</UButton>
        </div>
      </template>
    </UModal>

    <UModal :open="openEditThreadModal" @update:open="openEditThreadModal = $event" title="Редактировать тред">
      <template #body>
        <UForm class="space-y-4" :state="editThreadFormState" @submit="onSubmitEditThread">
          <UFormField label="Заголовок" name="title" required>
            <UInput v-model="editThreadFormState.title" required placeholder="Заголовок треда" class="w-full" />
          </UFormField>
          <UFormField label="Текст" name="text" required>
            <UInput v-model="editThreadFormState.text" required placeholder="Текст треда" class="w-full" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="formLoading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal :open="openDeleteThreadModal" @update:open="openDeleteThreadModal = $event" title="Удалить тред?">
      <template #body>
        <UiText>Вы уверены, что хотите удалить тред <b>{{ thread?.title }}</b>?</UiText>
        <div class="flex justify-end gap-2 mt-4">
          <UButton @click="openDeleteThreadModal = false">Отмена</UButton>
          <UButton color="error" @click="confirmDeleteThread" :loading="formLoading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectThreadStore } from '~/stores/useProjectThreadStore'
import { useProjectThreadCommentStore } from '~/stores/useProjectThreadCommentStore'
import type { ProjectThreadCommentDto, ProjectThreadDto, CreateProjectThreadCommentRequest, UpdateProjectThreadCommentRequest, UpdateProjectThreadRequest } from '~/types/request.types'

definePageMeta({
  layout: 'project',
  title: 'Тред',
})
const route = useRoute()
const router = useRouter()
const projectId = computed(() => route.params.id as string)
const threadId = computed(() => route.params.threadId as string)
const threadStore = useProjectThreadStore()
threadStore.projectId = projectId.value
const commentStore = useProjectThreadCommentStore()
commentStore.threadId = threadId.value

const thread = ref<ProjectThreadDto | null>(null)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const openDeleteThreadModal = ref(false)
const formLoading = ref(false)
const selectedComment = ref<ProjectThreadCommentDto | null>(null)
const editFormState = ref<UpdateProjectThreadCommentRequest>({ id: '', text: '' })
const openEditThreadModal = ref(false)
const editThreadFormState = ref<UpdateProjectThreadRequest>({ id: threadId.value, title: '', text: '' })

async function fetchThreadAndComments() {
  await commentStore.list();
  thread.value = await threadStore.get(threadId.value)
  if (thread.value) {
    editThreadFormState.value = { id: thread.value.id, title: thread.value.title, text: thread.value.text }
  }
}

onMounted(fetchThreadAndComments)

const onSubmitComment = async (comment: CreateProjectThreadCommentRequest) => {
  if (!comment.text) return
  formLoading.value = true
  await commentStore.create({ id: threadId.value, text: comment.text })
  await commentStore.list()
  comment.text = ''
  formLoading.value = false
}

function onEditComment(comment: ProjectThreadCommentDto) {
  selectedComment.value = comment
  editFormState.value = { id: comment.id, text: comment.text }
  openEditModal.value = true
}

async function onSubmitEditComment() {
  if (!selectedComment.value) return
  formLoading.value = true
  await commentStore.update({ id: selectedComment.value.id, text: editFormState.value.text })
  openEditModal.value = false
  formLoading.value = false
  await commentStore.list()
}

function onDeleteComment(comment: ProjectThreadCommentDto) {
  selectedComment.value = comment
  openDeleteModal.value = true
}

async function confirmDeleteComment() {
  if (!selectedComment.value) return
  formLoading.value = true
  await commentStore.deleteComment(selectedComment.value.id)
  openDeleteModal.value = false
  formLoading.value = false
  await commentStore.list()
}

async function onSubmitEditThread() {
  if (!thread.value) return
  formLoading.value = true
  await threadStore.update({ id: thread.value.id, title: editThreadFormState.value.title, text: editThreadFormState.value.text })
  openEditThreadModal.value = false
  formLoading.value = false
  await fetchThreadAndComments()
}

async function onArchiveThread() {
  if (!thread.value) return
  formLoading.value = true
  await threadStore.update({
    id: thread.value.id,
    title: thread.value.title,
    text: thread.value.text,
    isArchived: true,
    isClosed: thread.value.isClosed
  })
  formLoading.value = false
  await fetchThreadAndComments()
}

async function onCloseThread() {
  if (!thread.value) return
  formLoading.value = true
  await threadStore.update({
    id: thread.value.id,
    title: thread.value.title,
    text: thread.value.text,
    isArchived: thread.value.isArchived,
    isClosed: true
  })
  formLoading.value = false
  await fetchThreadAndComments()
}

async function confirmDeleteThread() {
  if (!thread.value) return
  formLoading.value = true
  await threadStore.deleteThread(thread.value.id)
  formLoading.value = false
  openDeleteThreadModal.value = false
  router.push(`/project/${projectId}/threads`)
}
</script>
