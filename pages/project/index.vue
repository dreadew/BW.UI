<template>
  <div>
    <UiHeading size="2xl" class="mb-6">Проекты</UiHeading>
    <div class="flex items-center gap-4 mb-4">
      <UInput v-model="search" placeholder="Поиск по названию..." class="w-64" />
      <UButton color="primary" @click="openCreateModal = true">Создать проект</UButton>
    </div>
    <div v-if="filteredProjects.length === 0" class="flex justify-center items-center h-64">
      <UCard class="flex flex-col items-center justify-center p-8">
        <UIcon name="i-lucide-folder-open" class="text-4xl text-primary mb-2" />
        <UiHeading size="lg">Нет проектов</UiHeading>
        <UiText color="gray" class="mt-2">
          Создайте первый проект, чтобы начать работу!
        </UiText>
      </UCard>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <UCard v-for="project in filteredProjects" :key="project.id" class="flex flex-col justify-between">
        <div>
          <UiHeading size="lg">{{ project.name }}</UiHeading>
          <div class="text-xs text-gray-400 mt-1">ID: {{ project.id }}</div>
          <div class="text-xs text-gray-400 mt-1">Создано: {{ project.createdAt }}</div>
        </div>
        <div class="flex gap-2 mt-4">
          <NuxtLink :to="`/project/${project.id}`">
            <UButton size="sm" color="primary">Открыть</UButton>
          </NuxtLink>
          <UButton size="sm" color="danger" variant="soft" @click="onDelete(project)">Удалить</UButton>
        </div>
      </UCard>
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
          <UButton color="danger" @click="confirmDelete" :loading="formLoading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectStore } from '~/stores/useProjectStore'
import { storeToRefs } from 'pinia'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { createProjectRequestSchema } from '~/schemas/generated.schema'

const projectStore = useProjectStore()
const { projects, isLoading } = storeToRefs(projectStore)

const search = ref('')
const openCreateModal = ref(false)
const openDeleteModal = ref(false)
const formLoading = ref(false)
const formState = ref({ name: '', workspaceId: '' })
const projectToDelete = ref(null)

const createFormSchema = toTypedSchema(createProjectRequestSchema)

const filteredProjects = computed(() => {
  if (!search.value) return projects.value
  return projects.value.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
})

const onSubmitCreate = async () => {
  formLoading.value = true
  await projectStore.create(formState.value)
  openCreateModal.value = false
  formState.value = { name: '', workspaceId: '' }
  formLoading.value = false
}

const onDelete = (project) => {
  projectToDelete.value = project
  openDeleteModal.value = true
}

const confirmDelete = async () => {
  formLoading.value = true
  await projectStore.delete(projectToDelete.value.id)
  openDeleteModal.value = false
  formLoading.value = false
}
</script>
