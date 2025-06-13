<template>
  <div class="p-4">
    <div class="flex items-center justify-between mb-4">
      <UiHeading size="md">Секции проекта</UiHeading>
      <UButton color="primary" icon="i-heroicons-plus" @click="openCreateModal = true" variant="solid" />
    </div>
    <div>
      <div v-if="sectionStore.loading" class="flex justify-center items-center">
        <USkeleton class="w-full h-96 mt-2" />
      </div>
      <div v-else>
        <div v-if="sectionStore.data.length === 0" class="flex justify-center items-center min-h-[120px]">
          <UiText color="neutral">Нет секций</UiText>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard variant="subtle" v-for="section in sectionStore.data.filter(x => x.tasks.length > 0)" :key="section.id"
            class="relative group/section">
            <div class="flex items-center justify-between mb-2">
              <UiHeading size="sm">{{ section.name }}</UiHeading>
              <div class="flex gap-1 items-center">
                <div class="flex gap-1 opacity-0 group-hover/section:opacity-100 transition">
                  <UTooltip text="Создать задачу">
                    <UButton size="xs" color="primary" icon="i-heroicons-plus" variant="subtle"
                      @click="onCreateTask(section)" />
                  </UTooltip>
                  <UTooltip text="Редактировать">
                    <UButton size="xs" color="secondary" icon="i-heroicons-pencil" variant="subtle"
                      @click="onEdit(section)" />
                  </UTooltip>
                  <UTooltip text="Удалить">
                    <UButton size="xs" color="error" icon="i-heroicons-trash" variant="subtle"
                      @click="onDelete(section)" />
                  </UTooltip>
                </div>
              </div>
            </div>
            <div>
              <template v-if="section.tasks && section.tasks.length">
                <ProjectTaskCard v-for="task in section.tasks" :key="task.id" :task="task" :section-id="section.id"
                  @edit="onEditTask" @delete="onDeleteTask" class="mb-2" />
              </template>
              <template v-else>
                <UiText color="neutral" size="sm">В этой секции нет задач</UiText>
              </template>
            </div>
          </UCard>
        </div>
      </div>
    </div>
    <ProjectSectionCreateModal :open="openCreateModal" :project-id="projectId" :loading="formLoading"
      @update:open="openCreateModal = $event" @submit="onSubmitCreate" />
    <UModal :open="openEditModal" @update:open="openEditModal = $event" title="Редактировать секцию">
      <template #body>
        <UForm :state="editFormState" @submit="onSubmitEdit">
          <UFormField label="Название" name="name" required>
            <UInput class="w-full" v-model="editFormState.name" required placeholder="Название секции" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4 float-right" :loading="formLoading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal :open="openDeleteModal" @update:open="openDeleteModal = $event" title="Удалить секцию?">
      <template #body>
        <UiText color="darker-neutral">
          Вы уверены, что хотите удалить секцию <b>{{ selectedSection?.name }}</b>?
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
    <ProjectTaskCreateModal :open="openTaskCreateModal" :section-id="taskCreateSection?.id ?? ''" :id="projectId"
      :loading="taskFormLoading" @update:open="openTaskCreateModal = $event" @submit="onSubmitTaskCreate" />
    <ProjectTaskEditModal :open="openTaskEditModal" :loading="taskFormLoading"
      :task="editTaskState as UpdateTaskRequest" @update:open="openTaskEditModal = $event" @submit="onSubmitTaskEdit" />
    <UModal :open="openTaskDeleteModal" @update:open="openTaskDeleteModal = $event" title="Удалить задачу?">
      <template #body>
        <UiText color="darker-neutral">
          Вы уверены, что хотите удалить задачу <b>{{ deleteTaskState?.name }}</b>?
        </UiText>
      </template>
      <template #footer>
        <div class="w-full flex gap-2 justify-end">
          <UButton type="button" color="neutral" variant="ghost" @click="openTaskDeleteModal = false">Отмена
          </UButton>
          <UButton type="button" color="error" variant="solid" @click="confirmTaskDelete" :loading="taskStore.loading">
            Удалить
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSectionStore } from '~/stores/useSectionStore'
import type { CreateTaskRequest, SectionDto, UpdateTaskRequest, ShortTaskDto, CreateSectionRequest } from '~/types/request.types'

const props = defineProps<{ isActive?: boolean, projectId?: string }>()
const route = useRoute()
const projectId = computed(() => props.projectId || (route.params.id as string))
const sectionStore = useSectionStore()
const taskStore = useTaskStore()
sectionStore.projectId = projectId.value
taskStore.projectId = projectId.value

const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const openTaskCreateModal = ref(false)
const openTaskEditModal = ref(false)
const openTaskDeleteModal = ref(false)
const formLoading = ref(false)
const taskFormLoading = ref(false)
const selectedSection = ref<SectionDto | null>(null)
const taskCreateSection = ref<SectionDto | null>(null)
const editFormState = ref<{ name: string }>({ name: '' })
const editTaskState = ref<UpdateTaskRequest | null>(null)
const deleteTaskState = ref<ShortTaskDto | null>(null)

function onEdit(section: SectionDto) {
  selectedSection.value = section
  editFormState.value = { name: section.name }
  openEditModal.value = true
}

function onDelete(section: SectionDto) {
  selectedSection.value = section
  openDeleteModal.value = true
}

function onEditTask(task: ShortTaskDto) {
  editTaskState.value = {
    id: task.id,
    name: task.name,
    content: task.content ?? '',
    priorityTypeId: task.priorityType?.id ?? '',
    sectionId: task.sectionId ?? '',
    startedDate: task.startedDate ?? '',
    endDate: task.endDate ?? ''
  }
  openTaskEditModal.value = true
}

function onDeleteTask(task: ShortTaskDto) {
  deleteTaskState.value = task
  openTaskDeleteModal.value = true
}

function onCreateTask(section: SectionDto) {
  taskCreateSection.value = section
  openTaskCreateModal.value = true
}

async function onSubmitCreate(data: CreateSectionRequest) {
  formLoading.value = true
  await sectionStore.create({ ...data, id: projectId.value })
  openCreateModal.value = false
  formLoading.value = false
}

async function onSubmitEdit() {
  if (!selectedSection.value) return
  formLoading.value = true
  await sectionStore.update({ id: selectedSection.value.id, name: editFormState.value.name })
  openEditModal.value = false
  formLoading.value = false
}

async function confirmDelete() {
  if (!selectedSection.value) return
  formLoading.value = true
  await sectionStore.deleteSection(selectedSection.value.id)
  openDeleteModal.value = false
  formLoading.value = false
}

async function onSubmitTaskCreate(data: CreateTaskRequest) {
  taskFormLoading.value = true
  await taskStore.createTask({ ...data, startedDate: data.startedDate ? new Date(data.startedDate).toISOString() : '', endDate: data.endDate ? new Date(data.endDate).toISOString() : '' });
  openTaskCreateModal.value = false
  taskFormLoading.value = false
  await sectionStore.listByProject()
}

async function onSubmitTaskEdit(data: UpdateTaskRequest) {
  taskFormLoading.value = true
  await taskStore.updateTask({ ...data, startedDate: data.startedDate ? new Date(data.startedDate).toISOString() : '', endDate: data.endDate ? new Date(data.endDate).toISOString() : '' })
  openTaskEditModal.value = false
  taskFormLoading.value = false
  await sectionStore.listByProject()
}

async function confirmTaskDelete() {
  if (!deleteTaskState.value) return
  taskFormLoading.value = true
  await taskStore.deleteTask(deleteTaskState.value.id)
  openTaskDeleteModal.value = false
  taskFormLoading.value = false
  await sectionStore.listByProject()
}

onMounted(() => {
  sectionStore.projectId = projectId.value
  sectionStore.listByProject()
})

watch(() => projectId.value, () => {
  sectionStore.projectId = projectId.value
  sectionStore.listByProject()
})

watch(() => sectionStore.offset, () => {
  sectionStore.listByProject()
})
</script>
