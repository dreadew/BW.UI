<template>
  <div class="mt-4 flex flex-col gap-2">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <UiHeading level="3">Репозиторий</UiHeading>
      <UButton v-if="props.showRootCreate && (!props.store.data || props.store.data.length === 0)" color="primary"
        size="sm" class="ml-2" @click="showCreate = true">Создать директорию</UButton>
    </div>
    <USkeleton v-if="props.store.loading" class="h-96 w-full" />
    <div v-else-if="!props.store.data || props.store.data.length === 0"
      class="flex justify-center items-center min-h-[120px]">
      <UCard variant="subtle" class="w-full">
        <UiText color="neutral">Нет доступных директорий</UiText>
      </UCard>
    </div>
    <div v-if="!props.store.loading" class="flex flex-col gap-1 mt-2">
      <BaseDirectoryNode v-for="dir in props.store.data" :key="dir.id" :directory="dir" @open-create="onOpenCreate"
        @open-rename="onOpenRename" @open-delete="onOpenDelete" @upload-file="onOpenUpload"
        @delete-file="onOpenDeleteFile" />
    </div>
    <UModal v-model:open="showCreate" title="Создать директорию">
      <template #body>
        <UForm class="space-y-4" @submit.prevent="handleCreate" :state="createFormState">
          <UFormField label="Родительская директория" :error="createFormState.error">
            <USelect class="w-full" v-model="parentDirId" :items="directoryOptions" />
          </UFormField>
          <UFormField required label="Название директории">
            <UInput class="w-full" v-model="newDirName" placeholder="Введите название" autofocus />
          </UFormField>
          <div class="flex gap-2 justify-end mt-6">
            <UButton type="button" color="neutral" variant="ghost" @click="showCreate = false">Отмена</UButton>
            <UButton type="submit" color="primary" variant="solid">Создать</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="showRename" title="Переименовать директорию">
      <template #body>
        <UForm @submit.prevent="handleRename" :state="renameFormState">
          <UFormField required label="Новое название" :error="renameFormState.error">
            <UInput class="w-full" v-model="renameDirName" placeholder="Введите новое название" autofocus />
          </UFormField>
          <div class="flex gap-2 justify-end mt-6">
            <UButton type="button" color="neutral" variant="ghost" @click="showRename = false">Отмена</UButton>
            <UButton type="submit" color="primary" variant="solid">Переименовать</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="showDelete" title="Удаление директории">
      <template #body>
        <UiText color="darker-neutral">
          Вы уверены, что хотите удалить директорию <b>{{ selectedDir?.name }}</b>?
        </UiText>
      </template>
      <template #footer>
        <div class="w-full flex gap-2 justify-end">
          <UButton type="button" color="neutral" variant="ghost" @click="showDelete = false">Отмена</UButton>
          <UButton type="button" color="error" variant="solid" @click="handleDelete">Удалить</UButton>
        </div>
      </template>
    </UModal>
    <UModal v-model:open="showUpload" title="Загрузить файл">
      <template #body>
        <UForm class="space-y-4" @submit.prevent="handleUpload" :state="uploadFormState">
          <UFormField required label="Директория для загрузки" :error="uploadFormState.error">
            <USelect class="w-full" v-model="uploadDirId" :items="directoryOptions" />
          </UFormField>
          <UFormField required label="Файл">
            <div
              class="upload-dropzone flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg py-8 px-4 mb-4 cursor-pointer transition bg-muted hover:bg-accent"
              :class="{ 'border-primary': isDragActive }" @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave" @drop.prevent="onDrop" @click="triggerFileInput">
              <div class="text-4xl text-primary mb-2"><i class="i-heroicons-arrow-up-tray"></i></div>
              <div class="text-dimmed mb-1">Перетащите файл сюда или кликните для выбора</div>
              <div v-if="uploadFile" class="mt-2 text-primary font-medium">{{ uploadFile.name }}</div>
              <input type="file" ref="fileInput" class="hidden" @change="onFileChange" />
            </div>
          </UFormField>
          <UFormField label="Имя файла (опционально)">
            <UInput class="w-full" v-model="uploadFileName" placeholder="Имя файла" />
          </UFormField>
          <div class="flex gap-2 justify-end mt-6">
            <UButton type="button" color="neutral" variant="ghost" @click="showUpload = false">Отмена</UButton>
            <UButton type="submit" color="primary" variant="solid">Загрузить</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="showDeleteFile" title="Удаление файла">
      <template #body>
        <UiText color="darker-neutral">
          Вы уверены, что хотите удалить файл <b>{{ selectedFile?.artifact.name }}</b> из директории?
        </UiText>
        <div class="flex gap-2 justify-end mt-6">
          <UButton type="button" color="neutral" variant="ghost" @click="showDeleteFile = false">Отмена</UButton>
          <UButton type="button" color="error" variant="solid" @click="handleDeleteFile">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { ArtifactDto, BaseDirectoryDto } from '~/types/request.types'
import { ref, computed } from 'vue'
import type { BaseDirectoryStore } from '~/types/common.types';

const props = defineProps<{
  store: BaseDirectoryStore<BaseDirectoryDto>;
  objectId: string;
  showRootCreate?: boolean;
}>();

const showCreate = ref(false)
const showRename = ref(false)
const showDelete = ref(false)
const showUpload = ref(false)
const showDeleteFile = ref(false)

const createFormState = ref({ error: '' })
const renameFormState = ref({ error: '' })
const uploadFormState = ref({ error: '' })

const parentDirId = ref('')
const newDirName = ref('')
const renameDirName = ref('')
const uploadDirId = ref('')
const uploadFile = ref<File | null>(null)
const uploadFileName = ref('')
const selectedDir = ref<BaseDirectoryDto | null>(null)
const selectedFile = ref<{
  artifact: ArtifactDto;
  directory: BaseDirectoryDto;
} | null>(null)
const isDragActive = ref(false)

function collectDirectoryOptions(dirs: BaseDirectoryDto[], arr: { label: string, value: string }[] = []) {
  for (const dir of dirs) {
    arr.push({ label: dir.name, value: dir.id })
    if (dir.children && dir.children.length) {
      collectDirectoryOptions(dir.children, arr)
    }
  }
  return arr
}
const directoryOptions = computed(() => collectDirectoryOptions(props.store.data))

function onOpenCreate(dir: BaseDirectoryDto) {
  selectedDir.value = dir
  parentDirId.value = dir.id
  showCreate.value = true
}
function onOpenRename(dir: BaseDirectoryDto) {
  selectedDir.value = dir
  renameDirName.value = dir.name
  showRename.value = true
}
function onOpenDelete(dir: BaseDirectoryDto) {
  selectedDir.value = dir
  showDelete.value = true
}
function onOpenUpload(dir: BaseDirectoryDto) {
  selectedDir.value = dir
  uploadDirId.value = dir.id
  showUpload.value = true
}
function onOpenDeleteFile(payload: { artifact: ArtifactDto; directory: BaseDirectoryDto }) {
  selectedFile.value = payload
  showDeleteFile.value = true
}

async function handleCreate() {
  if (!newDirName.value) return
  await props.store.create({
    id: undefined,
    objectId: props.objectId,
    name: newDirName.value,
    parentId: parentDirId.value
  })
  showCreate.value = false
  newDirName.value = ''
  parentDirId.value = ''
}

async function handleRename() {
  if (!selectedDir.value || !renameDirName.value) return
  await props.store.update({
    id: selectedDir.value.id,
    objectId: props.objectId,
    name: renameDirName.value
  })
  showRename.value = false
  renameDirName.value = ''
}

async function handleDelete() {
  if (!selectedDir.value) return
  await props.store.delete(selectedDir.value.id)
  showDelete.value = false
}

async function handleUpload() {
  if (!uploadFile.value || !uploadDirId.value) return
  await props.store.uploadArtifact(uploadDirId.value, uploadFile.value)
  showUpload.value = false
  uploadFile.value = null
  uploadFileName.value = ''
}

async function handleDeleteFile() {
  if (!selectedFile.value) return
  await props.store.deleteArtifact(props.objectId, {
    id: selectedFile.value.artifact.id
  })
  showDeleteFile.value = false
}

function onDragOver() { isDragActive.value = true }
function onDragLeave() { isDragActive.value = false }
function onDrop(e: DragEvent) {
  isDragActive.value = false
  if (e.dataTransfer?.files?.length) {
    uploadFile.value = e.dataTransfer.files[0]
  }
}
function triggerFileInput() {
  const input = document.querySelector('input[type=file]') as HTMLInputElement
  input?.click()
}
function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length) {
    uploadFile.value = files[0]
  }
}
</script>
