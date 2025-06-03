<template>
    <div>
        <UiHeading size="2xl" class="mb-6">Папки и файлы</UiHeading>
        <div class="flex items-center gap-4 mb-4">
            <UInput v-model="search" placeholder="Поиск по названию папки..." class="w-64" />
            <UButton color="primary" @click="openCreateModal = true">Создать папку</UButton>
        </div>
        <div v-if="directories.length === 0" class="flex justify-center items-center h-64">
            <UCard class="flex flex-col items-center justify-center p-8">
                <UIcon name="i-lucide-folder-open" class="text-4xl text-primary mb-2" />
                <UiHeading size="lg">Нет папок</UiHeading>
                <UiText class="text-gray-500 mt-2">Создайте первую папку для хранения файлов и артефактов.</UiText>
            </UCard>
        </div>
        <div v-else>
            <UCard v-for="directory in filteredDirectories" :key="directory.id" class="mb-4">
                <div class="flex items-center justify-between">
                    <div>
                        <UiText class="font-bold">{{ directory.name }}</UiText>
                        <div class="text-xs text-gray-400 mt-1">ID: {{ directory.id }}</div>
                    </div>
                    <div class="flex gap-2">
                        <UButton size="xs" color="primary" variant="soft" @click="onEdit(directory)">Редактировать</UButton>
                        <UButton size="xs" color="error" variant="soft" @click="onDelete(directory)">Удалить</UButton>
                        <UButton size="xs" color="primary" variant="soft" @click="openUploadModalFor(directory)">Загрузить файл</UButton>
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
        <UModal v-model:open="openCreateModal" title="Создать папку">
            <template #body>
                <UForm :state="formState" :schema="createFormSchema" @submit="onSubmitCreate">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название папки" />
                    </UFormField>
                    <UButton type="submit" color="primary" class="mt-4" :loading="formLoading">Сохранить</UButton>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openUploadModal" title="Загрузить файл">
            <template #body>
                <UForm :state="uploadFormState" @submit="onUploadFile">
                    <UFormField label="Файл" name="file" required>
                        <UInput type="file" @change="onFileChange" required />
                    </UFormField>
                    <UButton type="submit" color="primary" class="mt-4" :loading="formLoading">Загрузить</UButton>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление папки">
            <template #body>
                <UiText color="error">Вы уверены, что хотите удалить папку "{{ selectedDirectory?.name }}"?</UiText>
            </template>
            <template #footer>
                <UButton color="neutral" @click="openDeleteModal = false">Отмена</UButton>
                <UButton color="error" @click="confirmDelete" :loading="formLoading">Удалить</UButton>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteArtifactModalFlag" title="Удалить артефакт?">
            <template #body>
                <UiText>Вы уверены, что хотите удалить артефакт <b>{{ selectedArtifact?.name }}</b>?</UiText>
                <div class="flex justify-end gap-2 mt-4">
                    <UButton @click="openDeleteArtifactModalFlag = false">Отмена</UButton>
                    <UButton color="error" @click="onDeleteArtifact" :loading="formLoading">Удалить</UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'workspace' })
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWorkspaceDirectoryStore } from '~/stores/useWorkspaceDirectoryStore'
import { createWorkspaceDirectoryRequestSchema } from '~/schemas/generated.schema'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'
import type { WorkspaceDirectory, WorkspaceDirectoryArtifact } from '~/types/response.types'
useHead({ title: 'Папки и файлы' })
const route = useRoute()
const workspaceId = computed(() => route.params.id as string)
const directoryStore = useWorkspaceDirectoryStore()
const { directories } = storeToRefs(directoryStore)
const search = ref('')
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const openUploadModal = ref(false)
const openDeleteArtifactModalFlag = ref(false)
const selectedDirectory = ref<WorkspaceDirectory | null>(null)
const selectedArtifact = ref<WorkspaceDirectoryArtifact | null>(null)
const formState = ref<any>({ name: '' })
const formLoading = ref(false)
const uploadFormState = ref({})
const uploadFile = ref<File | null>(null)
const uploadDirectoryId = ref<string | null>(null)
const createFormSchema = createWorkspaceDirectoryRequestSchema;

const filteredDirectories = computed(() => {
    if (!search.value) return directories.value
    return directories.value.filter(d => d.name.toLowerCase().includes(search.value.toLowerCase()))
})

function onEdit(directory: WorkspaceDirectory) {
    selectedDirectory.value = directory
    formState.value = { id: directory.id, name: directory.name }
    openEditModal.value = true
}
function onDelete(directory: WorkspaceDirectory) {
    selectedDirectory.value = directory
    openDeleteModal.value = true
}
function openUploadModalFor(directory: WorkspaceDirectory) {
    uploadDirectoryId.value = directory.id
    selectedDirectory.value = directory
    openUploadModal.value = true
}
function onFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files
    uploadFile.value = files && files[0] ? files[0] : null
}
async function confirmDelete() {
    if (!selectedDirectory.value) return
    formLoading.value = true
    await directoryStore.deleteDirectory(selectedDirectory.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await directoryStore.list(workspaceId.value)
}
async function onSubmitCreate() {
    formLoading.value = true
    await directoryStore.create({ ...formState.value, workspaceId: workspaceId.value })
    openCreateModal.value = false
    formLoading.value = false
    await directoryStore.list(workspaceId.value)
}
async function onSubmitEdit() {
    formLoading.value = true
    if (!selectedDirectory.value) return;
    await directoryStore.update(selectedDirectory.value.id, { ...formState.value })
    openEditModal.value = false
    formLoading.value = false
    await directoryStore.list(workspaceId.value)
}
async function onUploadFile() {
    if (!uploadDirectoryId.value || !uploadFile.value) return
    formLoading.value = true
    try {
        await directoryStore.uploadArtifact(uploadDirectoryId.value, uploadFile.value)
        await directoryStore.list(workspaceId.value)
    } finally {
        formLoading.value = false
        openUploadModal.value = false
        uploadFile.value = null
        uploadDirectoryId.value = null
    }
}
function openDeleteArtifactModal(directory: WorkspaceDirectory, artifact: WorkspaceDirectoryArtifact) {
    selectedDirectory.value = directory
    selectedArtifact.value = artifact
    openDeleteArtifactModalFlag.value = true
}
async function onDeleteArtifact() {
    if (!selectedDirectory.value || !selectedArtifact.value) return
    formLoading.value = true
    try {
        await directoryStore.deleteArtifact(selectedDirectory.value.id, { id: selectedArtifact.value.id, fromId: workspaceId.value })
        await directoryStore.list(workspaceId.value)
    } finally {
        formLoading.value = false
        openDeleteArtifactModalFlag.value = false
        selectedArtifact.value = null
    }
}
watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = { name: '' }
        selectedDirectory.value = null
    }
})
watch(workspaceId, (id) => {
    if (id) directoryStore.list(id)
})
</script>
