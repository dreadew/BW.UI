<template>
    <div class="w-full mx-auto min-h-[60vh] py-10">
        <div class="flex items-center justify-between mb-8">
            <UiHeading level="4">Репозиторий</UiHeading>
            <UButton color="primary" icon="i-heroicons-plus" @click="openCreateDialog(directoryTree)">
                Новая директория
            </UButton>
        </div>
        
        <DirectoryNode :directory="directoryTree"   @open-create="openCreateDialog"
            @open-rename="openRenameDialog" @open-delete="openDeleteDialog" @upload-file="openUploadDialog" @delete-file="openDeleteFileDialog" />

        <UModal v-model:open="showCreate">
            <template #header>
                <UiHeading level="6">Создать директорию</UiHeading>
            </template>
            <template #body>
                <UForm class="space-y-4" @submit.prevent="handleCreate" :state="createFormState">
                    <UFormField label="Родительская директория" :error="createFormState.error">
                        <USelect class="w-full" v-model="parentDirId" :items="directoryOptions" />
                    </UFormField>
                    <UFormField required label="Название директории">
                        <UInput class="w-full" v-model="newDirName" placeholder="Введите название" autofocus />
                    </UFormField>
                    <div class="flex gap-2 justify-end mt-6">
                        <UButton type="button" color="neutral" variant="ghost" @click="showCreate = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" variant="solid">Создать</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>

        <UModal v-model:open="showRename">
            <template #header>
                <UiHeading level="6">Переименовать директорию</UiHeading>
            </template>
            <template #body>
                <UForm @submit.prevent="handleRename" :state="renameFormState">
                    <UFormField required label="Новое название" :error="renameFormState.error">
                        <UInput class="w-full" v-model="renameDirName" placeholder="Введите новое название" autofocus />
                    </UFormField>
                    <div class="flex gap-2 justify-end mt-6">
                        <UButton type="button" color="neutral" variant="ghost" @click="showRename = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" variant="solid">Переименовать</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>

        <UModal v-model:open="showDelete">
            <template #header>
                <UiHeading level="6">Удалить директорию?</UiHeading>
            </template>
            <template #body>
                <UiText color="darker-neutral">
                    Вы уверены, что хотите удалить директорию <b>{{ selectedDir?.name }}</b>?
                </UiText>
                <div class="flex gap-2 justify-end mt-6">
                    <UButton type="button" color="neutral" variant="ghost" @click="showDelete = false">Отмена</UButton>
                    <UButton type="button" color="error" variant="solid" @click="handleDelete">Удалить</UButton>
                </div>
            </template>
        </UModal>

        <UModal v-model:open="showUpload">
            <template #header>
                <UiHeading level="6">Загрузить файл</UiHeading>
            </template>
            <template #body>
                <UForm class="space-y-4" @submit.prevent="handleUpload" :state="uploadFormState">
                    <UFormField required label="Директория для загрузки" :error="uploadFormState.error">
                        <USelect class="w-full" v-model="uploadDirId" :items="directoryOptions" />
                    </UFormField>
                    <UFormField required label="Файл">
                        <div class="upload-dropzone flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-8 px-4 mb-4 cursor-pointer transition bg-gray-50 hover:bg-blue-50"
                            :class="{ 'border-blue-500 bg-blue-50': isDragActive }" @dragover.prevent="onDragOver"
                            @dragleave.prevent="onDragLeave" @drop.prevent="onDrop" @click="triggerFileInput">
                            <div class="text-4xl text-blue-400 mb-2"><i class="i-heroicons-arrow-up-tray"></i></div>
                            <div class="text-gray-700 mb-1">Перетащите файл сюда или кликните для выбора</div>
                            <div v-if="uploadFile" class="mt-2 text-blue-700 font-medium">{{ uploadFile.name }}
                            </div>
                            <input type="file" ref="fileInput" class="hidden" @change="onFileChange" />
                        </div>
                    </UFormField>
                    <UFormField label="Имя файла (опционально)">
                        <UInput class="w-full" v-model="uploadFileName" placeholder="Имя файла" />
                    </UFormField>
                    <div class="flex gap-2 justify-end mt-6">
                        <UButton type="button" color="neutral" variant="ghost" @click="showUpload = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" variant="solid">Загрузить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>

        <UModal v-model:open="showDeleteFile">
            <template #header>
                <UiHeading level="6">Удалить файл?</UiHeading>
            </template>
            <template #body>
                <UiText color="darker-neutral">
                    Вы уверены, что хотите удалить файл <b>{{ selectedFile?.artifact.name }}</b> из директории <b>{{
                        selectedFile?.directory.name }}</b>?
                </UiText>
                <div class="flex gap-2 justify-end mt-6">
                    <UButton type="button" color="neutral" variant="ghost" @click="showDeleteFile = false">Отмена
                    </UButton>
                    <UButton type="button" color="error" variant="solid" @click="handleDeleteFile">Удалить</UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import DirectoryNode from '~/components/test-ui/DirectoryNode.vue'
import type { DirectoryDto, FileUploadRequest, FileDeleteRequest } from '~/types/request.types'

const directoryTree = ref<DirectoryDto>({
    id: 'root',
    name: 'Workspace Root',
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    parent: undefined,
    children: [
        {
            id: 'dir1',
            name: 'Документы',
            isDeleted: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            parent: undefined,
            children: [],
            artifacts: [
                { id: 'a1', name: 'ТЗ.pdf', path: '/Документы/ТЗ.pdf', createdAt: '2024-01-01T00:00:00Z' }
            ]
        },
        {
            id: 'dir2',
            name: 'Исходники',
            isDeleted: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            parent: undefined,
            children: [
                {
                    id: 'dir3',
                    name: 'Backend',
                    isDeleted: false,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                    parent: undefined,
                    children: [],
                    artifacts: []
                }
            ],
            artifacts: []
        }
    ],
    artifacts: [
        { id: 'a2', name: 'README.md', path: '/README.md', createdAt: '2024-01-01T00:00:00Z' }
    ]
})

const showCreate = ref(false)
const showRename = ref(false)
const showDelete = ref(false)
const showUpload = ref(false)
const showDeleteFile = ref(false)
const selectedDir = ref<DirectoryDto | null>(null)
const selectedUploadDir = ref<DirectoryDto | null>(null)
const selectedFile = ref<{ directory: DirectoryDto, artifact: any } | null>(null)
const newDirName = ref('')
const renameDirName = ref('')
const uploadFile = ref<File | null>(null)
const uploadFileName = ref('')
const createFormState = reactive({ error: '' })
const renameFormState = reactive({ error: '' })
const uploadFormState = reactive({ error: '' })
const toast = useToast()
const fileInput = ref<HTMLInputElement | null>(null)
const isDragActive = ref(false)

function flattenDirectories(dir: DirectoryDto, prefix = ''): { value: string, label: string, ref: DirectoryDto }[] {
    const label = prefix ? `${prefix} / ${dir.name}` : dir.name
    let result = [{ value: dir.id, label, ref: dir }]
    for (const child of dir.children) {
        result = result.concat(flattenDirectories(child, label))
    }
    return result
}
const directoryOptions = computed(() => flattenDirectories(directoryTree.value))

const parentDirId = ref('')
const uploadDirId = ref('')

function openCreateDialog(dir: DirectoryDto) {
    selectedDir.value = dir
    parentDirId.value = dir.id
    newDirName.value = ''
    createFormState.error = ''
    showCreate.value = true
}
function openRenameDialog(dir: DirectoryDto) {
    selectedDir.value = dir
    renameDirName.value = dir.name
    renameFormState.error = ''
    showRename.value = true
}
function openDeleteDialog(dir: DirectoryDto) {
    selectedDir.value = dir
    showDelete.value = true
}
function handleCreate() {
    if (!parentDirId.value) {
        createFormState.error = 'Выберите родительскую директорию'
        return
    }
    if (!newDirName.value.trim()) {
        createFormState.error = 'Название обязательно'
        return
    }
    const parent = findDirectoryById(directoryTree.value, parentDirId.value)
    if (!parent) {
        createFormState.error = 'Родительская директория не найдена'
        return
    }
    parent.children.push({
        id: Math.random().toString(36).slice(2),
        name: newDirName.value.trim(),
        isDeleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parent: parent,
        children: [],
        artifacts: []
    })
    showCreate.value = false
    toast.success('Директория создана')
}
function findDirectoryById(dir: DirectoryDto, id: string): DirectoryDto | null {
    if (dir.id === id) return dir
    for (const child of dir.children) {
        const found = findDirectoryById(child, id)
        if (found) return found
    }
    return null
}
function handleRename() {
    if (!selectedDir.value) return
    if (!renameDirName.value.trim()) {
        renameFormState.error = 'Название обязательно'
        return
    }
    selectedDir.value.name = renameDirName.value.trim()
    showRename.value = false
    toast.success('Директория переименована')
}
function handleDelete() {
    if (!selectedDir.value) return
    function removeDir(parent: DirectoryDto, id: string) {
        parent.children = parent.children.filter(child => {
            if (child.id === id) return false
            removeDir(child, id)
            return true
        })
    }
    removeDir(directoryTree.value, selectedDir.value.id)
    showDelete.value = false
    toast.success('Директория удалена')
}
function openUploadDialog(dir: DirectoryDto) {
    selectedUploadDir.value = dir
    uploadDirId.value = dir.id
    uploadFile.value = null
    uploadFileName.value = ''
    uploadFormState.error = ''
    showUpload.value = true
    if (fileInput.value) fileInput.value.value = ''
}
function onFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files
    uploadFile.value = files && files[0] ? files[0] : null
    if (uploadFile.value && !uploadFileName.value) {
        uploadFileName.value = uploadFile.value.name
    }
}
function handleUpload() {
    const targetDir = findDirectoryById(directoryTree.value, uploadDirId.value)
    if (!targetDir) {
        uploadFormState.error = 'Выберите директорию для загрузки'
        return
    }
    if (!uploadFile.value) {
        uploadFormState.error = 'Файл не выбран'
        return
    }
    const reader = new FileReader()
    reader.onload = function (evt) {
        const content = new Uint8Array(evt.target?.result as ArrayBuffer)
        const req: FileUploadRequest = {
            fromId: targetDir.id,
            content: Array.from(content),
            fileName: uploadFileName.value || uploadFile.value!.name,
            contentType: uploadFile.value!.type || 'application/octet-stream',
        }
        targetDir.artifacts.push({
            id: Math.random().toString(36).slice(2),
            name: req.fileName,
            path: '/' + req.fileName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        showUpload.value = false
        toast.success('Файл загружен')
    }
    reader.readAsArrayBuffer(uploadFile.value)
}
function openDeleteFileDialog({ directory, artifact }: { directory: DirectoryDto, artifact: any }) {
    selectedFile.value = { directory, artifact }
    showDeleteFile.value = true
}
function handleDeleteFile() {
    if (!selectedFile.value) return
    const req: FileDeleteRequest = {
        id: selectedFile.value.artifact.id,
        fromId: selectedFile.value.directory.id,
    }
    selectedFile.value.directory.artifacts = selectedFile.value.directory.artifacts.filter(a => a.id !== req.id)
    showDeleteFile.value = false
    toast.success('Файл удалён')
}
function onDragOver(e: DragEvent) {
    isDragActive.value = true
}
function onDragLeave(e: DragEvent) {
    isDragActive.value = false
}
function onDrop(e: DragEvent) {
    isDragActive.value = false
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFile.value = e.dataTransfer.files[0]
        uploadFileName.value = uploadFile.value.name
    }
}
function triggerFileInput() {
    fileInput.value?.click()
}
</script>