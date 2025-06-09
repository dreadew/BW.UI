<template>
    <div class="w-full min-h-[60vh] mx-auto py-10">
        <div class="flex items-center justify-between mb-8">
            <UiHeading level="4">Список проектов</UiHeading>
            <UButton color="primary" icon="i-heroicons-plus" @click="openCreateDialog" variant="solid">Создать проект</UButton>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <UCard class="group relative" v-for="project in projects" :key="project.id">
                <template #default>
                    <div class="flex flex-col items-center gap-2">
                        <div v-if="project.pictureUrl" class="mb-4">
                            <img :src="project.pictureUrl" alt="Project image" class="w-24 h-24 rounded-xl object-cover shadow" />
                        </div>
                        <UiHeading level="6">{{ project.name }}</UiHeading>
                    </div>
                    <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <UButton size="xs" color="secondary" icon="i-heroicons-pencil" variant="subtle" @click="openEditDialog(project)" />
                        <UButton size="xs" color="error" icon="i-heroicons-trash" variant="subtle" @click="openDeleteDialog(project)" />
                    </div>
                </template>
            </UCard>
        </div>

        <UModal v-model:open="showEdit">
            <template #header>
                <UiHeading level="6">{{ editMode === 'create' ? 'Создать проект' : 'Редактировать проект' }}</UiHeading>
            </template>
            <template #body>
                <UForm @submit.prevent="handleEdit" :state="editFormState">
                    <UFormField required label="Название проекта" :error="editFormState.nameError">
                        <UInput class="w-full" v-model="editForm.name" placeholder="Введите название" autofocus />
                    </UFormField>
                    <UFormField label="URL картинки (опционально)">
                        <UInput class="w-full" v-model="editForm.pictureUrl" placeholder="https://..." />
                    </UFormField>
                    <div class="flex gap-2 justify-end mt-6">
                        <UButton type="button" color="neutral" variant="ghost" @click="showEdit = false">Отмена</UButton>
                        <UButton type="submit" color="primary" variant="solid">{{ editMode === 'create' ? 'Создать' : 'Сохранить' }}
                        </UButton>
                    </div>
                </UForm>
            </template>
        </UModal>

        <UModal v-model:open="showDelete">
            <template #header>
                <UiHeading level="6" color="error">Удалить проект?</UiHeading>
            </template>
            <template #body>
                <UiText color="darker-neutral">
                    Вы уверены, что хотите удалить проект <b>{{ selectedProject?.name }}</b>?
                </UiText>
                <div class="flex gap-2 justify-end mt-6">
                    <UButton type="button" color="neutral" variant="ghost" @click="showDelete = false">Отмена</UButton>
                    <UButton type="button" color="error" variant="solid" @click="handleDelete">Удалить</UButton>
                </div>
            </template>
        </UModal>
        <UNotifications />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { ProjectDto, CreateProjectRequest, UpdateProjectRequest } from '~/types/request.types'

const toast = useToast()

const projects = ref<ProjectDto[]>([
    {
        id: 'p1',
        name: 'CRM для агентства',
        pictureUrl: 'https://placehold.co/120x120/EEE/31343C?text=CRM',
        isDeleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        threads: [],
        roles: [],
        sections: []
    },
    {
        id: 'p2',
        name: 'Внутренний портал',
        pictureUrl: 'https://placehold.co/120x120/EEE/31343C?text=Portal',
        isDeleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        threads: [],
        roles: [],
        sections: []
    },
    {
        id: 'p3',
        name: 'Мобильное приложение',
        pictureUrl: 'https://placehold.co/120x120/EEE/31343C?text=App',
        isDeleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        threads: [],
        roles: [],
        sections: []
    }
])

const showEdit = ref(false)
const showDelete = ref(false)
const editMode = ref<'create' | 'edit'>('create')
const selectedProject = ref<ProjectDto | null>(null)
const editForm = reactive({
    id: '',
    name: '',
    pictureUrl: '',
})
const editFormState = reactive({
    nameError: ''
})

function openCreateDialog() {
    editMode.value = 'create'
    Object.assign(editForm, { id: '', name: '', pictureUrl: '' })
    editFormState.nameError = ''
    showEdit.value = true
}
function openEditDialog(project: ProjectDto) {
    editMode.value = 'edit'
    Object.assign(editForm, { id: project.id, name: project.name, pictureUrl: project.pictureUrl || '' })
    editFormState.nameError = ''
    showEdit.value = true
}
function openDeleteDialog(project: ProjectDto) {
    selectedProject.value = project
    showDelete.value = true
}
function handleEdit() {
    editFormState.nameError = !editForm.name.trim() ? 'Название обязательно' : ''
    if (editFormState.nameError) return
    if (editMode.value === 'create') {
        // CreateProjectRequest
        const req: CreateProjectRequest = {
            id: Math.random().toString(36).slice(2),
            name: editForm.name.trim(),
        }
        projects.value.push({
            id: req.id,
            name: req.name,
            pictureUrl: editForm.pictureUrl,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            threads: [],
            roles: [],
            sections: []
        })
        toast.success('Проект создан')
    } else {
        // UpdateProjectRequest
        const req: UpdateProjectRequest = {
            id: editForm.id,
            name: editForm.name.trim(),
        }
        const idx = projects.value.findIndex(p => p.id === req.id)
        if (idx !== -1) {
            projects.value[idx] = {
                ...projects.value[idx],
                name: req.name,
                pictureUrl: editForm.pictureUrl,
                updatedAt: new Date().toISOString(),
            }
            toast.success('Проект обновлён')
        }
    }
    showEdit.value = false
}
function handleDelete() {
    if (!selectedProject.value) return
    projects.value = projects.value.filter(p => p.id !== selectedProject.value!.id)
    showDelete.value = false
    toast.success('Проект удалён')
}
</script>
