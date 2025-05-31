<template>
  <div>
    <UiHeading size="xl" class="mb-6">Треды проекта</UiHeading>
    <div v-if="threads.length === 0" class="flex flex-col items-center justify-center h-64">
      <UIcon name="i-lucide-message-square" class="text-4xl text-primary mb-2" />
      <UiHeading size="lg">Нет тредов</UiHeading>
      <UiText color="gray">Создайте первый тред для обсуждения!</UiText>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="thread in threads" :key="thread.id" class="mb-4">
        <NuxtLink :to="`/project/${projectId}/threads/${thread.id}`">
          <UiHeading size="md">{{ thread.title }}</UiHeading>
          <UiText>{{ thread.description }}</UiText>
          <UiText size="xs" color="gray" class="mt-2">Создано: {{ thread.createdAt }}</UiText>
        </NuxtLink>
      </UCard>
    </div>
    <UButton color="primary" @click="openCreateModal = true" class="mb-4">Создать тред</UButton>
    <UModal v-model:open="openCreateModal" title="Создать тред">
      <template #body>
        <UForm :state="formState" :schema="formSchema" @submit="onSubmitThread">
          <UFormField label="Заголовок" name="title" required>
            <UInput v-model="formState.title" required placeholder="Заголовок треда" />
          </UFormField>
          <UFormField label="Описание" name="description">
            <UInput v-model="formState.description" placeholder="Описание треда" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectThreadStore } from '~/stores/useProjectThreadStore'
const route = useRoute()
const projectId = route.params.id
const threadStore = useProjectThreadStore()
const threads = ref([])
const loading = ref(false)
const openCreateModal = ref(false)
const formState = ref({
  title: '',
  description: ''
})
const formSchema = ref({
  title: { required: true },
  description: {}
})
const fetchThreads = async () => {
  threads.value = await threadStore.listByProject(projectId)
}
onMounted(fetchThreads)
const onSubmitThread = async () => {
  loading.value = true
  try {
    await threadStore.createThread(projectId, formState.value)
    formState.value = { title: '', description: '' }
    openCreateModal.value = false
    await fetchThreads()
  } catch (error) {
    console.error('Ошибка при создании треда:', error)
  } finally {
    loading.value = false
  }
}
</script>
