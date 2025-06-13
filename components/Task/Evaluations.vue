<template>
    <div>
        <BaseGrid :store="evaluationStore" :columns="evaluationColumns" editable without-heading show-include-deleted
            @edit="(item) => onEdit(item as TaskEvaluationDto)" @delete="(item) => onDelete(item as TaskEvaluationDto)"
            @create="openCreateModal = true" />
        <UModal v-model:open="openCreateModal" title="Добавить оценку">
            <template #body>
                <UForm class="space-y-4" :state="formState" @submit="onSubmitCreate">
                    <UFormField label="Тип активности" name="activityId" required>
                        <USelect v-model="formState.activityId" :items="activityTypeOptions"
                            :loading="isActivityTypesLoading" :disabled="isActivityTypesLoading"
                            placeholder="Выберите тип активности" class="w-full" />
                    </UFormField>
                    <UFormField label="Часы" name="hours" required>
                        <UInput class="w-full" v-model="formState.hours" required placeholder="Часы" type="number" />
                    </UFormField>
                    <UButton type="submit" color="primary" class="float-right" :loading="loading">Сохранить</UButton>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openEditModal" title="Редактировать оценку">
            <template #body>
                <UForm class="space-y-4" :state="formState" @submit="onSubmitEdit">
                    <UFormField label="Тип активности" name="activityId" required>
                        <USelect v-model="formState.activityId" :items="activityTypeOptions"
                            :loading="isActivityTypesLoading" :disabled="isActivityTypesLoading"
                            placeholder="Выберите тип активности" class="w-full" />
                    </UFormField>
                    <UFormField label="Часы" name="hours" required>
                        <UInput class="w-full" v-model="formState.hours" required placeholder="Часы" type="number" />
                    </UFormField>
                    <UButton type="submit" color="primary" class="float-right" :loading="loading">Обновить</UButton>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление оценки">
            <template #body>
                <UiText color="darker-neutral">Вы уверены, что хотите удалить оценку за <b>{{
                    selectedEvaluation?.activityType?.name ?? '' }}</b>?</UiText>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskEvaluationStore } from '~/stores/useTaskEvaluationStore'
import type { TableColumn } from '@nuxt/ui'
import type { CreateTaskEvaluationRequest, TaskEvaluationDto } from '~/types/request.types'
import { activityTypeServiceFactory } from '~/services/project/activityTypeServiceFactory'
import type { BaseSoftDeletableDtoWithName } from '~/types/request.types'

const route = useRoute()
const taskId = computed(() => route.params.taskId as string)
const evaluationStore = useTaskEvaluationStore()
evaluationStore.taskId = taskId.value

const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const loading = ref(false)
const selectedEvaluation = ref<TaskEvaluationDto | null>(null)

const formState = ref<CreateTaskEvaluationRequest>({ id: taskId.value, activityId: '', hours: 0 })
const activityTypeOptions = ref<{ label: string, value: string }[]>([])
const isActivityTypesLoading = ref(false)

const evaluationColumns: TableColumn<TaskEvaluationDto, unknown>[] = [
    { accessorKey: 'activityType.name', header: 'Тип активности', cell: ({ row }) => row.original.activityType?.name ?? '' },
    { accessorKey: 'hours', header: 'Часы', cell: ({ row }) => row.original.hours, enableSorting: true },
    { accessorKey: 'createdAt', header: 'Дата', cell: ({ row }) => row.original.createdAt ? new Date(row.original.createdAt).toLocaleString() : '', enableSorting: true },
    { id: 'action' }
]

async function fetchActivityTypes() {
    isActivityTypesLoading.value = true
    try {
        const res = await activityTypeServiceFactory.list({ limit: 100, offset: 0, includeDeleted: false }).execute()
        activityTypeOptions.value = (res || []).map((a: BaseSoftDeletableDtoWithName) => ({ label: a.name, value: a.id }))
    } finally {
        isActivityTypesLoading.value = false
    }
}

onMounted(async () => {
    await fetchActivityTypes()
    // await evaluationStore.list()
})

function onEdit(evaluation: TaskEvaluationDto) {
    const evalTyped = evaluation
    selectedEvaluation.value = evalTyped
    formState.value = {
        id: evaluation.id,
        activityId: evalTyped.activityType?.id ?? '',
        hours: evalTyped.hours
    }
    openEditModal.value = true
}

function onDelete(evaluation: TaskEvaluationDto) {
    const evalTyped = evaluation
    selectedEvaluation.value = evalTyped
    openDeleteModal.value = true
}

async function confirmDelete() {
    if (!selectedEvaluation.value) return
    loading.value = true
    await evaluationStore.deleteEvaluation(selectedEvaluation.value.id)
    loading.value = false
    openDeleteModal.value = false
    await evaluationStore.list()
}

async function onSubmitCreate() {
    loading.value = true
    await evaluationStore.create(formState.value)
    openCreateModal.value = false
    loading.value = false
    await evaluationStore.list()
}

async function onSubmitEdit() {
    if (!selectedEvaluation.value) return
    loading.value = true
    await evaluationStore.update({
        ...formState.value,
        id: selectedEvaluation.value.id,
    })
    openEditModal.value = false
    loading.value = false
    await evaluationStore.list()
}

watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = { ...formState.value, activityId: '', hours: 0 }
        selectedEvaluation.value = null
    }
})
</script>
