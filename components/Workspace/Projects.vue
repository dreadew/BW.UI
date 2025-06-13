<template>
  <div class="mt-4">
    <BaseCardLayout :store="projectStore" type="project" @openCreate="openCreateModal = true" @openEdit="onEdit"
      @openDelete="onDelete" @open-restore="onRestore" />
    <UModal v-model:open="openCreateModal" title="Создать проект">
      <template #body>
        <UForm :state="formState" @submit="onSubmitCreate">
          <UFormField label="Название" name="name" required>
            <UInput v-model="formState.name" required placeholder="Название проекта" class="w-full" />
          </UFormField>
          <div class="flex justify-end mt-4">
            <UButton type="submit" color="primary" :loading="formLoading">Создать</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openEditModal" title="Редактировать проект">
      <template #body>
        <UForm :state="formState" @submit="onSubmitEdit">
          <UFormField label="Название" name="name" required>
            <UInput v-model="formState.name" required placeholder="Название проекта" class="w-full" />
          </UFormField>
          <div class="flex justify-end mt-4">
            <UButton type="submit" color="primary" :loading="formLoading">Сохранить</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openDeleteModal" title="Удаление проекта">
      <template #body>
        <UiText color="darker-neutral">Вы уверены, что хотите удалить проект <b>"{{ selectedProject?.name }}"</b>?
        </UiText>
      </template>
      <template #footer>
        <div class="w-full flex justify-end gap-2">
          <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена
          </UButton>
          <UButton type="button" color="error" variant="solid" @click="confirmDelete" :loading="formLoading">Удалить
          </UButton>
        </div>
      </template>
    </UModal>
    <UModal v-model:open="openRestoreModal" title="Восстановление проекта">
      <template #body>
        <UiText color="darker-neutral">Вы уверены, что хотите восстановить проект <b>"{{ selectedProject?.name }}"</b>?
        </UiText>
      </template>
      <template #footer>
        <div class="w-full flex justify-end gap-2">
          <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена
          </UButton>
          <UButton type="button" color="secondary" variant="solid" @click="confirmRestore" :loading="formLoading">
            Восстановить
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '~/stores/useProjectStore'
import type { ProjectDto, CreateProjectRequest } from '~/types/request.types'

const route = useRoute()
const workspaceId = computed(() => route.params.id as string)
const projectStore = useProjectStore()
projectStore.workspaceId = workspaceId.value
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const openRestoreModal = ref(false)
const selectedProject = ref<ProjectDto | null>(null)
const formState = ref<CreateProjectRequest>({ id: workspaceId.value, name: '' })
const formLoading = ref(false)

const projects = ref<ProjectDto[]>([])

async function fetchProjects() {
  projectStore.workspaceId = workspaceId.value
  await projectStore.listByWorkspace()
  projects.value = projectStore.data
}

onMounted(fetchProjects)

function onEdit(project: ProjectDto) {
  selectedProject.value = project
  formState.value = { ...formState.value, name: project.name }
  openEditModal.value = true
}

function onDelete(project: ProjectDto) {
  selectedProject.value = project
  openDeleteModal.value = true
}

function onRestore(project: ProjectDto) {
  selectedProject.value = project
  openRestoreModal.value = true
}

async function confirmDelete() {
  if (!selectedProject.value) return
  formLoading.value = true
  await projectStore.deleteProject({ id: selectedProject.value.id })
  formLoading.value = false
  openDeleteModal.value = false
  await fetchProjects()
}

async function confirmRestore() {
  if (!selectedProject.value) return
  formLoading.value = true
  await projectStore.restore({ id: selectedProject.value.id })
  formLoading.value = false
  openRestoreModal.value = false
  await fetchProjects()
}

async function onSubmitCreate() {
  formLoading.value = true
  await projectStore.create({ ...formState.value, id: workspaceId.value })
  openCreateModal.value = false
  formLoading.value = false
  await fetchProjects()
}

async function onSubmitEdit() {
  if (!selectedProject.value) return
  formLoading.value = true
  await projectStore.update({ ...formState.value, id: selectedProject.value.id })
  openEditModal.value = false
  formLoading.value = false
  await fetchProjects()
}

watch([openCreateModal, openEditModal], ([create, edit]) => {
  if (!create && !edit) {
    formState.value = { ...formState.value, name: '' }
    selectedProject.value = null
  }
})
</script>
