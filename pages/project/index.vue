<template>
  <div>
    <UiHeading size="2xl" class="mb-6">Проекты</UiHeading>
    <div class="flex items-center gap-4 mb-4">
      <UInput v-model="search" placeholder="Поиск по названию..." class="w-64" />
      <UButton color="primary" @click="openCreateModal = true">Создать проект</UButton>
    </div>
    <div v-if="projects.length === 0" class="flex justify-center items-center h-64">
      <UCard class="flex flex-col items-center justify-center p-8">
        <UIcon name="i-lucide-folder-open" class="text-4xl text-primary mb-2" />
        <UiHeading size="lg">Нет проектов</UiHeading>
        <UiText color="neutral" class="mt-2">
          Создайте первый проект, чтобы начать работу!
        </UiText>
      </UCard>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <UCard v-for="project in projects" :key="project.id" class="flex flex-col justify-between">
        <div>
          <UiHeading size="lg">{{ project.name }}</UiHeading>
          <div class="text-xs text-gray-400 mt-1">ID: {{ project.id }}</div>
        </div>
        <div class="flex gap-2 mt-4">
          <NuxtLink :to="`/project/${project.id}`">
            <UButton size="sm" color="primary">Открыть</UButton>
          </NuxtLink>
          <UButton size="sm" color="error" variant="soft" @click="onDelete(project)">Удалить</UButton>
        </div>
      </UCard>
    </div>
    <div class="flex gap-2 mt-4">
      <UButton size="xs" :disabled="offset === 0" @click="prevPage">Назад</UButton>
      <UButton size="xs" :disabled="projects.length < limit" @click="nextPage">Вперёд</UButton>
    </div>
    <UModal v-model:open="openCreateModal" title="Создать проект">
      <template #body>
        <UForm :state="formState" :schema="createFormSchema" @submit="onSubmitCreate">
          <UFormField label="Название" name="name" required>
            <UInput v-model="formState.name" required placeholder="Название проекта" />
          </UFormField>
          <UFormField label="ID рабочего пространства" name="workspaceId" required>
            <UInput v-model="formState.workspaceId" required placeholder="ID рабочего пространства" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="formLoading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openDeleteModal" title="Удалить проект?">
      <template #body>
        <UiText>Вы уверены, что хотите удалить проект <b>{{ projectToDelete?.name }}</b>?</UiText>
        <div class="flex justify-end gap-2 mt-4">
          <UButton @click="openDeleteModal = false">Отмена</UButton>
          <UButton color="error" @click="confirmDelete" :loading="formLoading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useProjectStore } from '~/stores/useProjectStore'
import { storeToRefs } from 'pinia'
import { createProjectRequestSchema } from '~/schemas/generated.schema'
import type { ProjectDto } from '~/types/response.types'
useHead({ title: 'Проекты' })

const projectStore = useProjectStore()
const { projects, isLoading } = storeToRefs(projectStore)

const search = ref('')
const openCreateModal = ref(false)
const openDeleteModal = ref(false)
const formLoading = ref(false)
const formState = ref({ name: '', workspaceId: '' })
const projectToDelete = ref<ProjectDto | null>(null)
const limit = ref(20)
const offset = ref(0)
const { user } = useUserStore();

const createFormSchema = createProjectRequestSchema;

const fetchProjects = async () => {
  await projectStore.listByUser(user?.id as string, { limit: limit.value, offset: offset.value })
}

const nextPage = () => {
  offset.value += limit.value
  fetchProjects()
}
const prevPage = () => {
  offset.value = Math.max(0, offset.value - limit.value)
  fetchProjects()
}

watch([limit, offset], fetchProjects)

const onSubmitCreate = async () => {
  formLoading.value = true
  await projectStore.create(formState.value)
  openCreateModal.value = false
  formState.value = { name: '', workspaceId: '' }
  formLoading.value = false
}

const onDelete = (project: ProjectDto) => {
  projectToDelete.value = project
  openDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!projectToDelete.value) return;

  formLoading.value = true
  await projectStore.deleteProject({
    projectId: projectToDelete.value.id
  })
  openDeleteModal.value = false
  formLoading.value = false
}
</script>
