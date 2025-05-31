<template>
  <div>
    <UiHeading size="lg" class="mb-4">Артефакты задачи</UiHeading>
    <UCard v-for="artifact in artifacts" :key="artifact.id" class="mb-2">
      <UiText>{{ artifact.name }}</UiText>
      <UiText class="text-xs text-gray-400 mt-1">Тип: {{ artifact.type }}</UiText>
    </UCard>
    <UButton color="primary" @click="openCreateModal = true" class="mt-4">Добавить артефакт</UButton>
    <!-- Модальное окно для добавления артефакта -->
    <UModal v-model:open="openCreateModal" title="Добавить артефакт">
      <template #body>
        <UForm :state="formState" :schema="formSchema" @submit="onSubmitArtifact">
          <UFormField label="Название" name="name" required>
            <UInput v-model="formState.name" required placeholder="Название артефакта" />
          </UFormField>
          <UFormField label="Тип" name="type" required>
            <UInput v-model="formState.type" required placeholder="Тип артефакта" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openDeleteModal" title="Удалить артефакт?">
      <template #body>
        <UiText>Вы уверены, что хотите удалить артефакт?</UiText>
        <div class="flex justify-end gap-2 mt-4">
          <UButton @click="openDeleteModal = false">Отмена</UButton>
          <UButton color="danger" @click="onDeleteArtifact" :loading="loading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskDirectoryStore } from '~/stores/useTaskDirectoryStore'
const route = useRoute()
const taskId = route.params.taskId
const directoryStore = useTaskDirectoryStore()
const artifacts = ref([])
onMounted(async () => {
  artifacts.value = await directoryStore.listByTask(taskId)
})
const openCreateModal = ref(false)
const openDeleteModal = ref(false)
const formState = ref({
  name: '',
  type: ''
})
const formSchema = {
  // Определите схему валидации формы здесь
}
const loading = ref(false)
const onSubmitArtifact = async () => {
  loading.value = true
  try {
    // Логика для сохранения артефакта
  } catch (error) {
    console.error('Ошибка при сохранении артефакта:', error)
  } finally {
    loading.value = false
    openCreateModal.value = false
  }
}
const onDeleteArtifact = async () => {
  loading.value = true
  try {
    // Логика для удаления артефакта
  } catch (error) {
    console.error('Ошибка при удалении артефакта:', error)
  } finally {
    loading.value = false
    openDeleteModal.value = false
  }
}
</script>
