<template>
  <div>
    <UiHeading size="xl" class="mb-6">Треды проекта</UiHeading>
    <div v-if="threads.length === 0" class="flex flex-col items-center justify-center h-64">
      <UIcon name="i-lucide-message-square" class="text-4xl text-primary mb-2" />
      <UiHeading size="lg">Нет тредов</UiHeading>
      <UiText color="neutral">Создайте первый тред для обсуждения!</UiText>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="thread in threads" :key="thread.id" class="mb-4">
        <NuxtLink :to="`/project/${projectId}/threads/${thread.id}`">
          <UiHeading size="md">{{ thread.title }}</UiHeading>
          <UiText>{{ thread.text }}</UiText>
          <UiText size="xs" color="neutral" class="mt-2">Создано: {{ thread.createdAt }}</UiText>
        </NuxtLink>
      </UCard>
    </div>
    <div class="flex gap-2 mt-4">
      <UButton size="xs" :disabled="offset === 0" @click="prevPage">Назад</UButton>
      <UButton size="xs" :disabled="threads.length < limit" @click="nextPage">Вперёд</UButton>
    </div>
    <UButton color="primary" @click="openCreateModal = true" class="mb-4">Создать тред</UButton>
    <UModal v-model:open="openCreateModal" title="Создать тред">
      <template #body>
        <UForm :state="formState" :schema="formSchema" @submit="onSubmitThread">
          <UFormField label="Заголовок" name="title" required>
            <UInput v-model="formState.title" required placeholder="Заголовок треда" />
          </UFormField>
          <UFormField label="Описание" name="description" required>
            <UInput v-model="formState.text" placeholder="Описание треда" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectThreadStore } from '~/stores/useProjectThreadStore'
import type { ProjectThreadDto } from '~/types/response.types';
definePageMeta({ layout: 'project' });
useHead({ title: 'Треды проекта' })
const route = useRoute()
const projectId = route.params.id
const threadStore = useProjectThreadStore()
const threads = ref<ProjectThreadDto[]>([])
const loading = ref(false)
const openCreateModal = ref(false)
const formState = ref({
  title: '',
  text: '',
  fromId: ''
})
const formSchema = ref({
  title: { required: true },
  text: {}
})
const limit = ref(20)
const offset = ref(0)
const fetchThreads = async () => {
  threads.value = await threadStore.list(projectId as string, { limit: limit.value, offset: offset.value })
}
function nextPage() {
  offset.value += limit.value
  fetchThreads()
}
function prevPage() {
  offset.value = Math.max(0, offset.value - limit.value)
  fetchThreads()
}
watch([limit, offset], fetchThreads, { immediate: true })
onMounted(fetchThreads)
const onSubmitThread = async () => {
  loading.value = true
  try {
    await threadStore.create({
      projectId: projectId as string,
      title: formState.value.title,
      text: formState.value.text,
      fromId: formState.value.fromId
    })
    formState.value = { title: '', text: '', fromId: '' }
    openCreateModal.value = false
    await fetchThreads()
  } catch (error) {
    console.error('Ошибка при создании треда:', error)
  } finally {
    loading.value = false
  }
}
</script>
