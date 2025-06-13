<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <UiHeading size="md">Треды проекта</UiHeading>
      <div class="flex items-center gap-4">
        <UCheckbox v-model="threadStore.includeDeleted" label="Показывать удаленные" />
        <UButton color="primary" icon="i-heroicons-plus" @click="openCreateModal = true" variant="solid">Создать тред
        </UButton>
      </div>
    </div>
    <div>
      <div v-if="threadStore.loading" class="flex justify-center items-center">
        <USkeleton class="w-full h-96 mt-2" />
      </div>
      <div v-else>
        <div v-if="threadStore.data.length === 0" class="flex justify-center items-center min-h-[120px]">
          <UiText color="neutral">Нет тредов</UiText>
        </div>
        <div v-else class="flex flex-col gap-4">
          <UCard variant="subtle" v-for="thread in threadStore.data" :key="thread.id"
            class="flex-1 relative group cursor-pointer" @click="goToThread(thread)">
            <div class="flex items-center justify-between mb-2">
              <div class="space-y-2">
                <UBadge v-if="thread.isClosed" color="error" variant="soft">Закрыт</UBadge>
                <UBadge v-else-if="thread.isArchived" color="warning" variant="soft">В архиве</UBadge>
                <UBadge v-else-if="thread.isDeleted" color="neutral" variant="soft">Удалён</UBadge>
                <UiHeading level="4">{{ thread.title }}</UiHeading>
              </div>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <UTooltip text="Редактировать">
                  <UButton size="xs" color="secondary" icon="i-heroicons-pencil" variant="subtle"
                    @click.stop="onEdit(thread)" />
                </UTooltip>
                <UTooltip text="Удалить">
                  <UButton size="xs" color="error" icon="i-heroicons-trash" variant="subtle"
                    @click.stop="onDelete(thread)" />
                </UTooltip>
              </div>
            </div>
            <UiText size="sm" class="line-clamp-3">{{ thread.text }}</UiText>
          </UCard>
        </div>
      </div>
    </div>
    <UModal :open="openCreateModal" @update:open="openCreateModal = $event" title="Создать тред">
      <template #body>
        <UForm class="space-y-4" :state="formState" @submit="onSubmitCreate">
          <UFormField label="Заголовок" name="title" required>
            <UInput class="w-full" v-model="formState.title" required placeholder="Заголовок треда" />
          </UFormField>
          <UFormField label="Текст" name="text" required>
            <UInput class="w-full" v-model="formState.text" required placeholder="Текст треда" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4 float-right" :loading="formLoading">Создать</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal :open="openEditModal" @update:open="openEditModal = $event" title="Редактировать тред">
      <template #body>
        <UForm class="space-y-4" :state="editFormState" @submit="onSubmitEdit">
          <UFormField label="Заголовок" name="title" required>
            <UInput class="w-full" v-model="editFormState.title" required placeholder="Заголовок треда" />
          </UFormField>
          <UFormField label="Текст" name="text" required>
            <UInput class="w-full" v-model="editFormState.text" required placeholder="Текст треда" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4 float-right" :loading="formLoading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal :open="openDeleteModal" @update:open="openDeleteModal = $event" title="Удалить тред?">
      <template #body>
        <UiText color="darker-neutral">
          Вы уверены, что хотите удалить тред <b>{{ selectedThread?.title }}</b>?
        </UiText>
      </template>
      <template #footer>
        <div class="w-full flex gap-2 justify-end">
          <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена
          </UButton>
          <UButton type="button" color="error" variant="solid" @click="confirmDelete" :loading="formLoading">Удалить
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectThreadStore } from '~/stores/useProjectThreadStore'
import type { UpdateProjectThreadRequest, CreateProjectThreadRequest, ProjectThreadDto } from '~/types/request.types'

defineProps<{
  isActive?: boolean
}>()
const route = useRoute()
const router = useRouter()
const projectId = computed(() => route.params.id as string)
const threadStore = useProjectThreadStore()
threadStore.projectId = projectId.value

const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const formLoading = ref(false)
const selectedThread = ref<ProjectThreadDto | null>(null)

const formState = ref<CreateProjectThreadRequest>({ id: projectId.value, title: '', text: '' })
const editFormState = ref<UpdateProjectThreadRequest>({ id: '', title: '', text: '' })

async function fetchThreads() {
  await threadStore.list()
}

function onEdit(thread: ProjectThreadDto) {
  selectedThread.value = thread
  editFormState.value = { id: thread.id, title: thread.title, text: thread.text }
  openEditModal.value = true
}

function onDelete(thread: ProjectThreadDto) {
  selectedThread.value = thread
  openDeleteModal.value = true
}

function goToThread(thread: ProjectThreadDto) {
  router.push(`/project/${projectId.value}/threads/${thread.id}`)
}

async function onSubmitCreate() {
  formLoading.value = true
  await threadStore.create(formState.value)
  openCreateModal.value = false
  formLoading.value = false
  fetchThreads()
}
async function onSubmitEdit() {
  if (!selectedThread.value) return
  formLoading.value = true
  await threadStore.update({ ...editFormState.value, id: selectedThread.value.id })
  openEditModal.value = false
  formLoading.value = false
  fetchThreads()
}

async function confirmDelete() {
  if (!selectedThread.value) return
  formLoading.value = true
  await threadStore.deleteThread(selectedThread.value.id)
  openDeleteModal.value = false
  formLoading.value = false
  fetchThreads()
}

onMounted(fetchThreads)

watch(() => threadStore.includeDeleted, fetchThreads)

watch(() => threadStore.offset, fetchThreads)
</script>
