<template>
    <div>
        <BaseGrid :store="activityStore as unknown as BaseDataStore<BaseDto>" :columns="activityColumns" editable
            without-heading @create="openCreateModal = true" @edit="(item) => onEdit(item as TaskActivityDto)"
            @delete="(item) => onDelete(item as TaskActivityDto)" />
        <UModal v-model:open="openCreateModal" title="Добавить активность">
            <template #body>
                <UForm class="space-y-4" :state="formState" @submit="onSubmitCreate">
                    <UFormField label="Тип активности" name="activityId" required>
                        <USelect :loading="activityOptionsLoading" :disabled="activityOptionsLoading"
                            v-model="formState.activityId" :items="activityOptions"
                            placeholder="Выберите тип активности" class="w-full" />
                    </UFormField>
                    <UFormField required label="Дата" name="date">
                        <UPopover class="w-full">
                            <UButton color="neutral" icon="i-lucide-calendar">
                                {{ dateModel ? (dateModel ? df.format(dateModel.toDate(getLocalTimeZone())) :
                                    'Выбрать дату') : 'Выбрать дату' }}
                            </UButton>
                            <template #content>
                                <UCalendar v-model="dateModel" class="p-2" />
                            </template>
                        </UPopover>
                    </UFormField>
                    <UFormField label="Часы" name="workHours" required>
                        <UInput class="w-full" v-model="formState.workHours" required placeholder="Часы"
                            type="number" />
                    </UFormField>
                    <UButton type="submit" color="primary" class="float-right" :loading="loading">Сохранить</UButton>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openEditModal" title="Редактировать активность">
            <template #body>
                <UForm class="space-y-4" :state="formState" @submit="onSubmitEdit">
                    <UFormField label="Тип актвности" name="sectionId" required>
                        <USelect :loading="activityOptionsLoading" :disabled="activityOptionsLoading"
                            v-model="formState.activityId" :items="activityOptions"
                            placeholder="Выберите тип активности" class="w-full" />
                    </UFormField>
                    <UFormField label="Дата" name="date">
                        <UPopover class="w-full">
                            <UButton color="neutral" icon="i-lucide-calendar">
                                {{ dateModel ? (dateModel ? df.format(dateModel.toDate(getLocalTimeZone())) :
                                    'Выбрать дату') : 'Выбрать дату' }}
                            </UButton>
                            <template #content>
                                <UCalendar v-model="dateModel" class="p-2" />
                            </template>
                        </UPopover>
                    </UFormField>
                    <UFormField label="Часы" name="workHours" required>
                        <UInput class="w-full" v-model="formState.workHours" required placeholder="Часы"
                            type="number" />
                    </UFormField>
                    <UButton type="submit" color="primary" class="float-right" :loading="loading">Обновить</UButton>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление активности">
            <template #body>
                <UiText color="darker-neutral">Вы уверены, что хотите удалить активность за <b>{{ selectedActivity?.date
                    ? DateUtils.deserialize(selectedActivity.date)?.toLocaleString('ru-RU', {
                        day: '2-digit', month:
                            '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : '' }}</b>?</UiText>
            </template>
            <template #footer>
                <div class="w-full flex justify-end gap-2">
                    <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена
                    </UButton>
                    <UButton type="button" color="error" variant="solid" @click="confirmDelete" :loading="loading">
                        Удалить</UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
import { DateUtils } from '~/utils/date.utils';
import { DATE_DISPLAY_FORMAT } from '~/constants/date.constants';
import type { TableRow } from '@nuxt/ui'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { activityTypeServiceFactory } from '~/services/project/activityTypeServiceFactory'
import { useTaskActivityStore } from '~/stores/useTaskActivityStore'
import type { TaskActivityDto } from '~/types/request.types'
import type { CreateTaskActivityRequest, UpdateTaskActivityRequest } from '~/types/request.types'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'
import type { BaseDataStore } from '~/types/common.types';
import type { BaseDto } from '~/types/request.types';

const route = useRoute()
const taskId = computed(() => route.params.taskId as string)
const activityStore = useTaskActivityStore()
activityStore.taskId = taskId.value
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const loading = ref(false)
const selectedActivity = ref<TaskActivityDto | null>(null)
const formState = ref<CreateTaskActivityRequest>({ id: taskId.value, activityId: '', date: '', workHours: 0 })
const activityOptionsLoading = ref(false)
const activityOptions = ref<{ label: string, value: string }[]>([])
const dateModel = shallowRef(formState.value.date ? parseDate(formState.value.date) : null)
const df = new DateFormatter('ru-RU', { dateStyle: 'medium' })

const activityColumns = [
    { accessorKey: 'userId', header: 'Пользователь', cell: ({ row }: { row: TableRow<TaskActivityDto> }) => row.original.userId },
    { accessorKey: 'type', header: 'Тип', cell: ({ row }: { row: TableRow<TaskActivityDto> }) => row.original.activityType.name, enableSorting: true },
    { accessorKey: 'date', header: 'Дата', cell: ({ row }: { row: TableRow<TaskActivityDto> }) => row.original.date ? DateUtils.deserialize(row.original.date)?.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '', enableSorting: true },
    { accessorKey: 'workHours', header: 'Часы', cell: ({ row }: { row: TableRow<TaskActivityDto> }) => row.original.workHours, enableSorting: true },
    { id: 'action' }
]

async function fetchOptions() {
    try {
        activityOptionsLoading.value = true
        const activities = await activityTypeServiceFactory.list({
            limit: 100,
            offset: 0,
            includeDeleted: false
        }).execute()
        activityOptions.value = activities.map(act => ({ label: act.name, value: act.id }))
    } catch (error) {
        console.error('Ошибка при загрузке типов активности:', error)
    } finally {
        activityOptionsLoading.value = false
    }
}

onMounted(async () => {
    // await activityStore.list()
    await fetchOptions()
})

function onEdit(activity: TaskActivityDto) {
    const act = activity
    selectedActivity.value = act
    formState.value = {
        id: taskId.value,
        activityId: act.activityType.id,
        date: act.date,
        workHours: act.workHours
    }
    dateModel.value = act.date && toISODateString(act.date) ? parseDate(toISODateString(act.date)!) : null
    openEditModal.value = true
}

function onDelete(activity: TaskActivityDto) {
    const act = activity
    selectedActivity.value = act
    openDeleteModal.value = true
}

async function confirmDelete() {
    if (!selectedActivity.value) return
    loading.value = true
    await activityStore.deleteTaskActivity(selectedActivity.value.id)
    loading.value = false
    openDeleteModal.value = false
    await activityStore.list()
}

async function onSubmitCreate() {
    loading.value = true
    const req: CreateTaskActivityRequest = {
        ...formState.value,
        date: dateModel.value ? dateModel.value.toDate(getLocalTimeZone()).toISOString() : ''
    }
    await activityStore.create(req)
    openCreateModal.value = false
    loading.value = false
    await activityStore.list()
}

async function onSubmitEdit() {
    if (!selectedActivity.value) return
    loading.value = true
    const req: UpdateTaskActivityRequest = {
        ...formState.value,
        id: selectedActivity.value.id
    }
    await activityStore.update(req)
    openEditModal.value = false
    loading.value = false
    await activityStore.list()
}

watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = { id: taskId.value, activityId: '', date: '', workHours: 0 }
        selectedActivity.value = null
    }
})
</script>
