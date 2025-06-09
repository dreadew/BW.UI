<template>
    <div class="w-full mx-auto py-10">
        <div class="flex items-center justify-between mb-8">
            <UiHeading level="4">Журнал активности</UiHeading>
            <UButton color="primary" icon="i-heroicons-plus" @click="openCreateDialog" variant="solid">Добавить запись</UButton>
        </div>
        
        <UTable :data="activities" :columns="columns" class="w-full">
            <template #action-cell="{ row }">
                <div class="flex items-center gap-3">
                    <UButton size="xs" variant="ghost" color="primary" @click="showEdit = true" icon="i-heroicons-pencil" />
                    <UButton size="xs" variant="subtle" color="error" @click="showDelete = true" icon="i-heroicons-trash" />
                </div>
            </template>
        </UTable>

        <UModal v-model:open="showEdit">
            <template #header>
                <UiHeading level="6">{{ editMode === 'create' ? 'Добавить запись' : 'Редактировать запись' }}
                </UiHeading>
            </template>
            <template #body>
                <UForm class="space-y-4" @submit.prevent="handleEdit" :state="editFormState">
                    <UFormField required label="Дата" :error="editFormState.dateError">
                        <UInput class="w-full" type="date" v-model="editForm.date" />
                    </UFormField>
                    <UFormField required label="Пользователь" :error="editFormState.userError">
                        <UInput class="w-full" v-model="editForm.userId" placeholder="ID пользователя" />
                    </UFormField>
                    <UFormField required label="Тип активности" :error="editFormState.typeError">
                        <USelect class="w-full" v-model="editForm.activityTypeId"
                            :items="activityTypes.map(t => ({ value: t.id, label: t.name }))" />
                    </UFormField>
                    <UFormField required label="Часы" :error="editFormState.hoursError">
                        <UInput class="w-full" type="number" v-model.number="editForm.workHours" min="0.1" step="0.1" />
                    </UFormField>
                    <UFormField label="Задача">
                        <UInput class="w-full" v-model="editForm.taskName" placeholder="Название задачи" />
                    </UFormField>
                    <div class="flex gap-2 justify-end mt-6">
                        <UButton type="button" color="neutral" variant="ghost" @click="showEdit = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" variant="solid">{{ editMode === 'create' ? 'Добавить' :
                            'Сохранить' }}</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>

        <UModal v-model:open="showDelete">
            <template #header>
                <UiHeading level="6" color="danger">Удалить запись?</UiHeading>
            </template>
            <template #body>
                <UiText color="darker-neutral">
                    Вы уверены, что хотите удалить запись активности <b>{{ selectedActivity?.taskName }}</b>?
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
import type { TableColumn } from '@nuxt/ui'
import { h, ref, reactive } from 'vue'
import type { TaskActivityDto, BaseConstantDto, CreateTaskActivityRequest, UpdateTaskActivityRequest } from '~/types/request.types'

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ru-RU')
}

const toast = useToast()

const activityTypes: BaseConstantDto[] = [
    { id: 'dev', name: 'Разработка', isDeleted: false, createdAt: '', updatedAt: '' },
    { id: 'test', name: 'Тестирование', isDeleted: false, createdAt: '', updatedAt: '' },
    { id: 'review', name: 'Разработка', isDeleted: false, createdAt: '', updatedAt: '' },
]

const activities = ref<(TaskActivityDto & { taskName: string, activityTypeId?: string })[]>([
    {
        id: 'a1',
        userId: 'Иванов И.И',
        date: '2025-06-01',
        workHours: 16,
        activityType: activityTypes[0],
        createdAt: '2025-06-01T10:00:00Z',
        updatedAt: '2025-06-01T10:00:00Z',
        taskName: 'Реализация авторизации',
        activityTypeId: 'dev',
    },
    {
        id: 'a2',
        userId: 'Иванов И.И',
        date: '2025-06-02',
        workHours: 8,
        activityType: activityTypes[1],
        createdAt: '2025-06-02T14:00:00Z',
        updatedAt: '2025-06-02T14:00:00Z',
        taskName: 'Покрытие тестами',
        activityTypeId: 'test',
    },
    {
        id: 'a3',
        userId: 'Петров И.В.',
        date: '2025-06-03',
        workHours: 4,
        activityType: activityTypes[2],
        createdAt: '2025-06-03T09:00:00Z',
        updatedAt: '2025-06-03T09:00:00Z',
        taskName: 'Исправление бага при регистрации',
        activityTypeId: 'review',
    }
])

const columns: TableColumn<any>[] = [
    {
        id: 'date',
        accessorKey: 'date',
        header: 'Дата',
        cell: ({ row }) => h('span', { class: 'py-3 block' }, formatDate(row.original.date))
    },
    {
        id: 'userId',
        accessorKey: 'userId',
        header: 'Пользователь',
        cell: ({ row }) => h('span', { class: 'py-3 block' }, row.original.userId)
    },
    {
        id: 'activityType',
        accessorKey: 'activityType',
        header: 'Тип активности',
        cell: ({ row }) => h('span', { class: 'w-full justify-center inline-flex items-center px-4 py-3 rounded bg-blue-100 text-blue-800 text-xs font-medium' }, row.original.activityType.name)
    },
    {
        id: 'workHours',
        accessorKey: 'workHours',
        header: 'Часы',
        cell: ({ row }) => h('span', { class: 'py-3 block' }, row.original.workHours)
    },
    {
        id: 'taskName',
        accessorKey: 'taskName',
        header: 'Задача',
        cell: ({ row }) => h('span', { class: 'py-3 block' }, row.original.taskName)
    },
    {
        id: 'action',
    }
]

const showEdit = ref(false)
const showDelete = ref(false)
const editMode = ref<'create' | 'edit'>('create')
const selectedActivity = ref<any>(null)
const editForm = reactive({
    id: '',
    userId: '',
    date: '',
    activityTypeId: '',
    workHours: 1,
    taskName: '',
})
const editFormState = reactive({
    dateError: '',
    userError: '',
    typeError: '',
    hoursError: ''
})

function openCreateDialog() {
    editMode.value = 'create'
    Object.assign(editForm, { id: '', userId: '', date: '', activityTypeId: activityTypes[0].id, workHours: 1, taskName: '' })
    Object.assign(editFormState, { dateError: '', userError: '', typeError: '', hoursError: '' })
    showEdit.value = true
}
function openEditDialog(activity: any) {
    editMode.value = 'edit'
    Object.assign(editForm, {
        id: activity.id,
        userId: activity.userId,
        date: activity.date,
        activityTypeId: activity.activityTypeId || activity.activityType.id,
        workHours: activity.workHours,
        taskName: activity.taskName,
    })
    Object.assign(editFormState, { dateError: '', userError: '', typeError: '', hoursError: '' })
    showEdit.value = true
}
function openDeleteDialog(activity: any) {
    selectedActivity.value = activity
    showDelete.value = true
}
function handleEdit() {
    // Валидация
    editFormState.dateError = !editForm.date ? 'Дата обязательна' : ''
    editFormState.userError = !editForm.userId ? 'Пользователь обязателен' : ''
    editFormState.typeError = !editForm.activityTypeId ? 'Тип обязателен' : ''
    editFormState.hoursError = !editForm.workHours || editForm.workHours <= 0 ? 'Часы > 0' : ''
    if (editFormState.dateError || editFormState.userError || editFormState.typeError || editFormState.hoursError) return

    const typeObj = activityTypes.find(t => t.id === editForm.activityTypeId)!
    if (editMode.value === 'create') {
        // CreateTaskActivityRequest
        const req: CreateTaskActivityRequest = {
            id: Math.random().toString(36).slice(2),
            activityId: editForm.activityTypeId,
            date: editForm.date,
            workHours: editForm.workHours,
        }
        activities.value.push({
            id: req.id,
            userId: editForm.userId,
            date: req.date,
            workHours: req.workHours,
            activityType: typeObj,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            taskName: editForm.taskName,
            activityTypeId: req.activityId,
        })
        toast.add({ title: 'Запись добавлена', color: 'success' })
    } else {
        // UpdateTaskActivityRequest
        const req: UpdateTaskActivityRequest = {
            id: editForm.id,
            activityId: editForm.activityTypeId,
            date: editForm.date,
            workHours: editForm.workHours,
        }
        const idx = activities.value.findIndex(a => a.id === req.id)
        if (idx !== -1) {
            activities.value[idx] = {
                ...activities.value[idx],
                userId: editForm.userId,
                date: req.date,
                workHours: req.workHours,
                activityType: typeObj,
                updatedAt: new Date().toISOString(),
                taskName: editForm.taskName,
                activityTypeId: req.activityId,
            }
            toast.add({ title: 'Запись обновлена', color: 'success' })
        }
    }
    showEdit.value = false
}
function handleDelete() {
    if (!selectedActivity.value) return
    activities.value = activities.value.filter(a => a.id !== selectedActivity.value.id)
    showDelete.value = false
    toast.add({ title: 'Запись удалена', color: 'success' })
}
</script>
