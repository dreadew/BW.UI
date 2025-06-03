<template>
  <div>
    <UiHeading size="xl" class="mb-6">Секции проекта</UiHeading>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard v-for="section in sections" :key="section.id">
        <UiHeading size="md">{{ section.name }}</UiHeading>
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
    <div class="flex gap-4 mt-8 overflow-x-auto min-h-[60vh]">
      <div v-for="section in sections" :key="section.id" class="min-w-[320px] bg-gray-50 rounded-lg p-4 shadow flex flex-col">
        <UiHeading size="md">{{ section.name }}</UiHeading>
        <draggable v-model="section.tasks" group="tasks" :animation="200" class="flex-1 mt-4 space-y-2">
          <template #item="{ element: task }">
            <UCard class="cursor-move">
              <UiText>{{ task.title }}</UiText>
              <UiText color="neutral" size="xs" class="mt-1">Статус: {{ task.status }}</UiText>
            </UCard>
          </template>
        </draggable>
      </div>
    </div>
    <div class="flex gap-2 mt-4">
      <UButton size="xs" :disabled="offset === 0" @click="prevPage">Назад</UButton>
      <UButton size="xs" :disabled="sections.length < limit" @click="nextPage">Вперёд</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSectionStore } from '~/stores/useSectionStore'
import { createSectionRequestSchema } from '~/schemas/generated.schema'
import type { SectionDto } from '~/types/response.types'
definePageMeta({ layout: 'project' })
useHead({ title: 'Секции проекта' })
const route = useRoute()
const projectId = String(route.params.id)
const sectionStore = useSectionStore()
const sections = ref<SectionDto[]>([])
const limit = ref(20)
const offset = ref(0)
onMounted(async () => {
  sections.value = await sectionStore.listByProject(projectId as string, { limit: limit.value, offset: offset.value });
})
const openCreateModal = ref(false)
const formState = ref({ name: '', projectId })
const formSchema = createSectionRequestSchema;
const loading = ref(false)
const onSubmitSection = async () => {
  loading.value = true
  try {
    await sectionStore.create({ ...formState.value, projectId: String(route.params.id) })
    openCreateModal.value = false
    formState.value = { name: '', projectId }
    sections.value = await sectionStore.listByProject(projectId as string, { limit: limit.value, offset: offset.value })
  } catch (error) {
    console.error('Ошибка при создании секции:', error)
  } finally {

  }
}
async function fetchSections() {
  sections.value = await sectionStore.listByProject(projectId as string, { limit: limit.value, offset: offset.value })
}

function nextPage() {
  offset.value += limit.value
  fetchSections()
}
function prevPage() {
  offset.value = Math.max(0, offset.value - limit.value)
  fetchSections()
}

watch([limit, offset], fetchSections)
</script>