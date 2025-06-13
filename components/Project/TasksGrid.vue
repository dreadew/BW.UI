<template>
    <div class="p-4">
        <BaseGrid :store="taskStore" :columns="columns" editable show-include-deleted
            search-placeholder="Поиск по задачам..." @create="openCreateModal = true"
            @edit="(item) => onEdit(item as ShortTaskDto)" @delete="(item) => onDelete(item as ShortTaskDto)">
            <template #title>
                Задачи проекта
            </template>
        </BaseGrid>
        <ProjectTaskCreateModal :open="openCreateModal" :section-id="sectionOptions[0]?.value || ''" :id="projectId"
            :loading="formLoading" @update:open="openCreateModal = $event" @submit="onSubmitCreate" />
        <ProjectTaskEditModal :open="openEditModal" :loading="formLoading" :task="editTaskState!"
            @update:open="openEditModal = $event" @submit="onSubmitEdit" />
        <UModal :open="openDeleteModal" @update:open="openDeleteModal = $event" title="Удалить задачу?">
            <template #body>
                <UiText color="darker-neutral">
                    Вы уверены, что хотите удалить задачу <b>{{ deleteTaskState?.name }}</b>?
                </UiText>
            </template>
            <template #footer>
                <div class="w-full flex gap-2 justify-end">
                    <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена
                    </UButton>
                    <UButton type="button" color="error" variant="solid" @click="confirmDelete" :loading="formLoading">
                        Удалить</UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '~/stores/useTaskStore'
import { useSectionStore } from '~/stores/useSectionStore'
import type { ShortTaskDto, UpdateTaskRequest, CreateTaskRequest, TaskDto } from '~/types/request.types'
import type { TableRow } from '@nuxt/ui'

const props = defineProps<{
    projectId?: string
}>()
const route = useRoute()
const projectId = computed(() => props.projectId || (route.params.id as string))
const taskStore = useTaskStore()
taskStore.projectId = projectId.value
const sectionStore = useSectionStore()
sectionStore.projectId = projectId.value

const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const formLoading = ref(false)
const editTaskState = ref<UpdateTaskRequest | null>(null)
const deleteTaskState = ref<ShortTaskDto | null>(null)
const sectionOptions = computed(() => sectionStore.data.map(s => ({ value: s.id, label: s.name })))

const columns = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Название' },
    { accessorKey: 'sectionId', header: 'Секция', cell: ({ row }: { row: TableRow<TaskDto> }) => getSectionName(row.original.id) },
    { accessorKey: 'startedDate', header: 'Начало' },
    { accessorKey: 'endDate', header: 'Конец' },
]

function getSectionName(sectionId?: string) {
    const section = sectionStore.data.find(s => s.id === sectionId)
    return section ? section.name : '—'
}

function onEdit(task: ShortTaskDto) {
    editTaskState.value = {
        id: task.id,
        name: task.name,
        content: task.content ?? '',
        priorityTypeId: task.priorityType?.id ?? '',
        sectionId: task.sectionId ?? '',
        startedDate: task.startedDate ?? '',
        endDate: task.endDate ?? ''
    }
    openEditModal.value = true
}
function onDelete(task: ShortTaskDto) {
    deleteTaskState.value = task
    openDeleteModal.value = true
}

async function onSubmitCreate(data: CreateTaskRequest) {
    formLoading.value = true
    await taskStore.createTask(data)
    openCreateModal.value = false
    formLoading.value = false
    await fetchTasks()
}
async function onSubmitEdit(data: UpdateTaskRequest) {
    formLoading.value = true
    await taskStore.updateTask(data)
    openEditModal.value = false
    formLoading.value = false
    await fetchTasks()
}
async function confirmDelete() {
    if (!deleteTaskState.value) return
    formLoading.value = true
    await taskStore.deleteTask(deleteTaskState.value.id)
    openDeleteModal.value = false
    formLoading.value = false
    await fetchTasks()
}

async function fetchTasks() {
    await taskStore.listByProject()
    await sectionStore.listByProject()
}

onMounted(fetchTasks)
watch(() => projectId.value, fetchTasks)
</script>
