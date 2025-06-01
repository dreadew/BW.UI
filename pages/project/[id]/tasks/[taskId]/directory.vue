<template>
  <div>
    <UiHeading size="lg" class="mb-4">Директории и артефакты задачи</UiHeading>
    <div v-if="directories.length === 0" class="text-gray-500">Нет директорий</div>
    <div v-else>
      <UCard v-for="directory in directories" :key="directory.id" class="mb-4">
        <div class="flex items-center justify-between">
          <div>
            <UiText class="font-bold">{{ directory.name }}</UiText>
            <div class="text-xs text-gray-400 mt-1">ID: {{ directory.id }}</div>
          </div>
          <div class="flex gap-2">
            <UButton size="xs" color="primary" variant="soft" @click="openUploadModalFor(directory)">Загрузить файл</UButton>
            <UButton size="xs" color="error" variant="soft" @click="onDeleteDirectory(directory)">Удалить директорию</UButton>
          </div>
        </div>
        <div class="mt-2">
          <div v-if="directory.artifacts && directory.artifacts.length > 0">
            <div class="font-semibold mb-1">Артефакты:</div>
            <div class="flex flex-wrap gap-2">
              <UCard v-for="artifact in directory.artifacts" :key="artifact.id" class="p-2 flex items-center gap-2">
                <UIcon name="i-lucide-file" />
                <span>{{ artifact.name }}</span>
                <UButton size="xs" color="error" variant="soft" @click="openDeleteArtifactModal(directory, artifact)">Удалить</UButton>
              </UCard>
            </div>
          </div>
          <div v-else class="text-xs text-gray-400">Нет артефактов</div>
        </div>
      </UCard>
    </div>
    <div class="flex gap-2 mt-4">
      <UButton color="primary" @click="openCreateModal = true">Добавить директорию</UButton>
    </div>
    <!-- Модалка создания директории -->
    <UModal v-model:open="openCreateModal" title="Добавить директорию">
      <template #body>
        <UForm :state="formState" :schema="formSchema" @submit="onSubmitDirectory">
          <UFormField label="Название" name="name" required>
            <UInput v-model="formState.name" required placeholder="Название директории" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <!-- Модалка загрузки файла -->
    <UModal v-model:open="openUploadModal" title="Загрузить файл">
      <template #body>
        <UForm :state="uploadFormState" @submit="onUploadFile">
          <UFormField label="Файл" name="file" required>
            <UInput type="file" @change="onFileChange" required />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="loading">Загрузить</UButton>
        </UForm>
      </template>
    </UModal>
    <!-- Модалка удаления артефакта -->
    <UModal v-model:open="openDeleteArtifactModalFlag" title="Удалить артефакт?">
      <template #body>
        <UiText>Вы уверены, что хотите удалить артефакт <b>{{ selectedArtifact?.name }}</b>?</UiText>
        <div class="flex justify-end gap-2 mt-4">
          <UButton @click="openDeleteArtifactModalFlag = false">Отмена</UButton>
          <UButton color="error" @click="onDeleteArtifact" :loading="loading">Удалить</UButton>
        </div>
      </template>
    </UModal>
    <!-- Модалка удаления директории -->
    <UModal v-model:open="openDeleteDirectoryModal" title="Удалить директорию?">
      <template #body>
        <UiText>Вы уверены, что хотите удалить директорию <b>{{ selectedDirectory?.name }}</b>?</UiText>
        <div class="flex justify-end gap-2 mt-4">
          <UButton @click="openDeleteDirectoryModal = false">Отмена</UButton>
          <UButton color="error" @click="onConfirmDeleteDirectory" :loading="loading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskDirectoryStore } from '~/stores/useTaskDirectoryStore'
import type { TaskDirectoryArtifactDto, TaskDirectoryDto } from '~/types/response.types'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'
useHead({ title: 'Директории задачи' })

definePageMeta({ layout: 'project' })
const route = useRoute()
const taskId = route.params.taskId as string
const directoryStore = useTaskDirectoryStore()
const directories = ref<TaskDirectoryDto[]>([])
const loading = ref(false)

const openCreateModal = ref(false)
const openUploadModal = ref(false)
const openDeleteArtifactModalFlag = ref(false)
const openDeleteDirectoryModal = ref(false)
const formState = ref({ name: '' })
const formSchema = {}
const uploadFormState = ref({})
const uploadFile = ref<File | null>(null)
const selectedDirectory = ref<TaskDirectoryDto | null>(null)
const selectedArtifact = ref<TaskDirectoryArtifactDto | null>(null)

const fetchDirectories = async () => {
  directories.value = await directoryStore.list(taskId) ?? []
}

onMounted(fetchDirectories)

const onSubmitDirectory = async () => {
  loading.value = true
  try {
    const success = await directoryStore.create({
      taskId,
      name: formState.value.name
    })
    if (success) {
      await fetchDirectories()
    }
  } finally {
    loading.value = false
    openCreateModal.value = false
    formState.value = { name: '' }
  }
}

function openUploadModalFor(directory: TaskDirectoryDto) {
  selectedDirectory.value = directory
  openUploadModal.value = true
}

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  uploadFile.value = files && files[0] ? files[0] : null
}

const onUploadFile = async () => {
  if (!selectedDirectory.value || !uploadFile.value) return
  loading.value = true
  try {
    await directoryStore.uploadArtifact(selectedDirectory.value.id, uploadFile.value)
    await fetchDirectories()
  } finally {
    loading.value = false
    openUploadModal.value = false
    uploadFile.value = null
    selectedDirectory.value = null
  }
}

function openDeleteArtifactModal(directory: TaskDirectoryDto, artifact: TaskDirectoryArtifactDto) {
  selectedDirectory.value = directory
  selectedArtifact.value = artifact
  openDeleteArtifactModalFlag.value = true
}

const onDeleteArtifact = async () => {
  if (!selectedArtifact.value) return
  loading.value = true
  try {
    await directoryStore.deleteArtifact({
      id: selectedArtifact.value.id,
      fromId: taskId
    })
    await fetchDirectories()
  } finally {
    loading.value = false
    openDeleteArtifactModalFlag.value = false
    selectedArtifact.value = null
  }
}

function onDeleteDirectory(directory: TaskDirectoryDto) {
  selectedDirectory.value = directory
  openDeleteDirectoryModal.value = true
}

const onConfirmDeleteDirectory = async () => {
  if (!selectedDirectory.value) return
  loading.value = true
  try {
    await directoryStore.deleteTaskDirectory(selectedDirectory.value.id)
    await fetchDirectories()
  } finally {
    loading.value = false
    openDeleteDirectoryModal.value = false
    selectedDirectory.value = null
  }
}
</script>
