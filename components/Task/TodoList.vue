<template>
    <div class="mt-4 space-y-4">
        <div class="w-full flex flex-wrap items-center justify-between gap-2">
            <UiHeading level="5">Подзадачи</UiHeading>
            <div class="flex items-center gap-2">
                <UButton v-if="!todoListStore.data.length && !todoListStore.loading" color="primary" class="float-right"
                    @click="createTodoList">Создать список подзадач</UButton>
                <UButton v-if="todoListStore.data.length !== 0" color="primary" class="float-right"
                    @click="openCreateModal = true">Добавить подзадачу
                </UButton>
            </div>
        </div>
        <USkeleton v-if="todoListStore.loading" class="w-full h-28 mt-2" />
        <UCard v-if="todoItems.length === 0 && !todoListStore.loading"
            class="flex items-center justify-center p-4 text-neutral">
            <UiText>Нет подзадач. Нажмите "Добавить подзадачу", чтобы создать новую.</UiText>
        </UCard>
        <UCard v-for="item in todoItems" :key="item.id" class="mb-2 flex items-center justify-between gap-4">
            <div class="space-y-2 mb-4">
                <UiHeading size="2xl" weight="semibold">{{ item.name }}</UiHeading>
                <UiText size="sm" color="neutral">Длительность: {{ item.duration }} ч</UiText>
                <UiText size="sm" color="neutral">Статус: {{ item.isCompleted ? 'Выполнено' : 'В процессе' }}</UiText>
                <UiText size="sm" color="neutral">Срок: {{
                    DateUtils.deserialize(item.startedDate)?.toLocaleDateString('ru-RU', {
                        day: '2-digit', month: '2-digit',
                    year: 'numeric' }) }} - {{ DateUtils.deserialize(item.endDate)?.toLocaleDateString('ru-RU', {
                        day: '2-digit', month: '2-digit',
                        year: 'numeric' }) }}</UiText>
            </div>
            <div class="flex gap-2">
                <UButton size="xs" color="primary" variant="subtle" @click="onEdit(item)">Редактировать</UButton>
                <UButton size="xs" color="error" variant="subtle" @click="onDelete(item)">Удалить</UButton>
            </div>
        </UCard>
        <UModal v-model:open="openCreateModal" title="Добавить подзадачу">
            <template #body>
                <UForm class="space-y-4" :state="formState" @submit="onSubmitCreate">
                    <UFormField label="Название" name="name" required>
                        <UInput class="w-full" v-model="formState.name" required placeholder="Название подзадачи" />
                    </UFormField>
                    <UFormField label="Длительность (ч)" name="duration" required>
                        <UInput class="w-full" v-model="formState.duration" type="number" required
                            placeholder="Длительность" />
                    </UFormField>
                    <UFormField label="Дата начала" name="startedDate" required>
                        <UPopover class="w-full">
                            <UButton color="neutral" icon="i-lucide-calendar">
                                {{ startedDateModel ? df.format(startedDateModel.toDate(getLocalTimeZone())) : `Выбрать
                                дату` }}
                            </UButton>
                            <template #content>
                                <UCalendar v-model="startedDateModel" class="p-2" />
                            </template>
                        </UPopover>
                    </UFormField>
                    <UFormField label="Дата окончания" name="endDate" required>
                        <UPopover class="w-full">
                            <UButton color="neutral" icon="i-lucide-calendar">
                                {{ endDateModel ? df.format(endDateModel.toDate(getLocalTimeZone())) : 'Выбрать дату' }}
                            </UButton>
                            <template #content>
                                <UCalendar v-model="endDateModel" class="p-2" />
                            </template>
                        </UPopover>
                    </UFormField>
                    <UButton type="submit" color="primary" class="float-right" :loading="loading">Сохранить</UButton>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openEditModal" title="Редактировать подзадачу">
            <template #body>
                <UForm class="space-y-4" :state="formState" @submit="onSubmitEdit">
                    <UFormField label="Название" name="name" required>
                        <UInput class="w-full" v-model="formState.name" required placeholder="Название подзадачи" />
                    </UFormField>
                    <UFormField label="Длительность (ч)" name="duration" required>
                        <UInput class="w-full" v-model="formState.duration" type="number" required
                            placeholder="Длительность" />
                    </UFormField>
                    <UFormField label="Дата начала" name="startedDate" required>
                        <UPopover class="w-full">
                            <UButton color="neutral" icon="i-lucide-calendar">
                                {{ startedDateModel ? df.format(startedDateModel.toDate(getLocalTimeZone())) : `Выбрать
                                дату` }}
                            </UButton>
                            <template #content>
                                <UCalendar v-model="startedDateModel" class="p-2" />
                            </template>
                        </UPopover>
                    </UFormField>
                    <UFormField label="Дата окончания" name="endDate" required>
                        <UPopover class="w-full">
                            <UButton color="neutral" icon="i-lucide-calendar">
                                {{ endDateModel ? df.format(endDateModel.toDate(getLocalTimeZone())) : 'Выбрать дату' }}
                            </UButton>
                            <template #content>
                                <UCalendar v-model="endDateModel" class="p-2" />
                            </template>
                        </UPopover>
                    </UFormField>
                    <UButton type="submit" color="primary" class="float-right" :loading="loading">Сохранить</UButton>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удалить подзадачу?">
            <template #body>
                <UiText>Вы уверены, что хотите удалить подзадачу <b>{{ selectedItem?.name }}</b>?</UiText>
                <div class="flex justify-end gap-2 mt-4">
                    <UButton @click="openDeleteModal = false">Отмена</UButton>
                    <UButton color="error" class="float-right" @click="onSubmitDelete" :loading="loading">Удалить
                    </UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, shallowRef, watch } from 'vue'
import { useTaskTodoListStore } from '~/stores/useTaskTodoListStore'
import { useRoute } from 'vue-router'
import type { CreateTaskTodoListItemRequest, TaskTodoListItemDto } from '~/types/request.types'
import { parseDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const route = useRoute()
const taskId = computed(() => route.params.taskId as string)
const todoListStore = useTaskTodoListStore()
todoListStore.taskId = taskId.value

const todoItems = ref<TaskTodoListItemDto[]>([])
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const loading = ref(false)
const formState = ref<CreateTaskTodoListItemRequest>({ id: taskId.value, name: '', duration: 1, startedDate: '', endDate: '' })

const selectedItem = ref<TaskTodoListItemDto | null>(null)
const todoListId = ref<string | null>(null)

const df = new DateFormatter('ru-RU', { dateStyle: 'medium' })

const startedDateModel = shallowRef(formState.value.startedDate ? parseDate(toISODateString(formState.value.startedDate)!) : null)
const endDateModel = shallowRef(formState.value.endDate ? parseDate(toISODateString(formState.value.endDate)!) : null)

onMounted(async () => {
    const lists = await todoListStore.list()
    if (lists.length) {
        todoListId.value = lists[0].id
        todoItems.value = lists[0].items
    } else {
        todoListId.value = null
        todoItems.value = []
    }
})

async function ensureTodoList() {
    if (!todoListId.value) {
        await todoListStore.createTodoList({ id: taskId.value })
        const lists = await todoListStore.list()
        if (lists.length) todoListId.value = lists[0].id
    }
}

async function refreshItems() {
    const lists = await todoListStore.list()
    todoItems.value = lists.length ? lists[0].items : []
}

async function onSubmitCreate() {
    loading.value = true
    await ensureTodoList()
    if (!todoListId.value) {
        loading.value = false
        return
    }
    await todoListStore.createTodoListItem({
        id: todoListId.value,
        name: formState.value.name,
        duration: formState.value.duration,
        startedDate: formState.value.startedDate,
        endDate: formState.value.endDate
    })
    openCreateModal.value = false
    loading.value = false
    await refreshItems()
}

function onEdit(item: TaskTodoListItemDto) {
    selectedItem.value = item
    formState.value = { ...item }
    openEditModal.value = true
}

async function onSubmitEdit() {
    if (!selectedItem.value) return
    loading.value = true
    await todoListStore.updateTodoListItem({
        id: selectedItem.value.id,
        name: formState.value.name,
        duration: formState.value.duration,
        startedDate: formState.value.startedDate,
        endDate: formState.value.endDate,
        isCompleted: selectedItem.value.isCompleted ?? false
    })
    openEditModal.value = false
    loading.value = false
    await refreshItems()
}

function onDelete(item: TaskTodoListItemDto) {
    selectedItem.value = item
    openDeleteModal.value = true
}

async function onSubmitDelete() {
    if (!selectedItem.value) return
    loading.value = true
    await todoListStore.deleteTodoListItem(selectedItem.value.id)
    openDeleteModal.value = false
    loading.value = false
    await refreshItems()
}

async function createTodoList() {
    loading.value = true
    await todoListStore.createTodoList({ id: taskId.value })
    openCreateModal.value = false
    loading.value = false
    await refreshItems()
}

watch(startedDateModel, (val) => {
    formState.value.startedDate = val ? val.toDate(getLocalTimeZone()).toISOString().split('T')[0] : ''
})

watch(endDateModel, (val) => {
    formState.value.endDate = val ? val.toDate(getLocalTimeZone()).toISOString().split('T')[0] : ''
})

watch(() => openEditModal.value, (val) => {
    if (val && selectedItem.value) {
        startedDateModel.value = selectedItem.value.startedDate ? parseDate(toISODateString(selectedItem.value.startedDate)!) : null
        endDateModel.value = selectedItem.value.endDate ? parseDate(toISODateString(selectedItem.value.endDate)!) : null
    }
})

watch(() => openCreateModal.value, (val) => {
    if (val) {
        startedDateModel.value = null
        endDateModel.value = null
    }
})
</script>
