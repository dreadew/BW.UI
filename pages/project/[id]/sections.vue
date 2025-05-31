<template>
  <div>
    <UiHeading size="xl" class="mb-6">Секции проекта</UiHeading>
    <!-- Здесь будет канбан-доска или список секций -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard v-for="section in sections" :key="section.id">
        <UiHeading size="md">{{ section.name }}</UiHeading>
        <UiText class="text-gray-500 mt-1">{{ section.description }}</UiText>
      </UCard>
    </div>
    <UButton color="primary" @click="openCreateModal = true" class="mt-4">Создать секцию</UButton>
    <UModal v-model:open="openCreateModal" title="Создать секцию">
      <template #body>
        <UForm :state="formState" :schema="formSchema" @submit="onSubmitSection">
          <UFormField label="Название" name="name" required>
            <UInput v-model="formState.name" required placeholder="Название секции" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <!-- Канбан-доска -->
    <div class="flex gap-4 mt-8 overflow-x-auto min-h-[60vh]">
      <div v-for="section in sections" :key="section.id" class="min-w-[320px] bg-gray-50 rounded-lg p-4 shadow flex flex-col">
        <UiHeading size="md">{{ section.name }}</UiHeading>
        <UiText class="text-gray-500 mt-1">{{ section.description }}</UiText>
        <draggable v-model="section.tasks" group="tasks" :animation="200" class="flex-1 mt-4 space-y-2">
          <template #item="{ element: task }">
            <UCard class="cursor-move">
              <UiText>{{ task.title }}</UiText>
              <UiText class="text-xs text-gray-400 mt-1">Статус: {{ task.status }}</UiText>
            </UCard>
          </template>
        </draggable>
        <UButton size="xs" color="primary" variant="soft" class="mt-2" @click="onAddTask(section)">Добавить задачу</UButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSectionStore } from '~/stores/useSectionStore'
import draggable from 'vuedraggable'
import { createSectionRequestSchema } from '~/schemas/generated.schema'
import { toTypedSchema } from '@vee-validate/zod'
const route = useRoute()
const projectId = route.params.id
const sectionStore = useSectionStore()
const sections = ref([])
onMounted(async () => {
  sections.value = await sectionStore.listByProject(projectId)
})
const openCreateModal = ref(false)
const formState = ref({ name: '', projectId })
const formSchema = toTypedSchema(createSectionRequestSchema)
const loading = ref(false)
const onSubmitSection = async () => {
  loading.value = true
  try {
    await sectionStore.createSection({ ...formState.value, projectId })
    openCreateModal.value = false
    formState.value = { name: '', projectId }
    sections.value = await sectionStore.listByProject(projectId)
  } catch (error) {
    console.error('Ошибка при создании секции:', error)
  } finally
