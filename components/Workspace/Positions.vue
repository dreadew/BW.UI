<template>
    <div>
        <BaseGrid :store="positionStore" :columns="columns" editable show-include-deleted without-heading
            @create="openCreateModal = true" @edit="onEdit" @delete="onDelete"></BaseGrid>
        <UModal v-model:open="openCreateModal" title="Создать должность">
            <template #body>
                <UForm :state="formState" @submit="onSubmitCreate">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название должности" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="button" color="neutral" variant="ghost" @click="openCreateModal = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" variant="solid" :loading="formLoading">Создать</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openEditModal" title="Редактировать должность">
            <template #body>
                <UForm :state="formState" @submit="onSubmitEdit">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название должности" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="button" color="neutral" variant="ghost" @click="openEditModal = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" variant="solid" :loading="formLoading">Обновить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление должности">
            <template #body>
                <UiText color="darker-neutral">Вы уверены, что хотите удалить должность <b>"{{ selectedPosition?.name
                }}"</b>?</UiText>
            </template>
            <template #footer>
                <div class="w-full flex justify-end gap-2">
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
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkspacePositionStore } from '~/stores/useWorkspacePositionStore'
import type { CreatePositionRequest, PositionDto } from '~/types/request.types'
import type { TableRow } from '@nuxt/ui'

useHead({ title: 'Должности рабочего пространства' })
const route = useRoute()
const workspaceId = computed(() => route.params.id as string)
const positionStore = useWorkspacePositionStore()
positionStore.workspaceId = workspaceId.value
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const selectedPosition = ref<PositionDto | null>(null)
const formState = ref<CreatePositionRequest>({ id: workspaceId.value, name: '' })
const formLoading = ref(false)
const columns = [
    { accessorKey: 'name', header: 'Название', cell: ({ row }: { row: TableRow<PositionDto> }) => row.original.name },
    {
        accessorKey: 'createdAt',
        header: 'Дата создания',
        cell: ({ row }: { row: TableRow<PositionDto> }) => row.original.createdAt ? new Date(DateUtils.deserialize(row.original.createdAt)!).toLocaleString() : '',
        enableSorting: true
    },
    {
        accessorKey: 'updatedAt',
        header: 'Дата обновления',
        cell: ({ row }: { row: TableRow<PositionDto> }) => row.original.updatedAt ? new Date(DateUtils.deserialize(row.original.updatedAt)!).toLocaleString() : 'Отсутствует',
        enableSorting: true
    },
    {
        id: 'action',
    }
]
function onEdit(position: PositionDto) {
    selectedPosition.value = position
    formState.value = { id: position.id, name: position.name }
    openEditModal.value = true
}
function onDelete(position: PositionDto) {
    selectedPosition.value = position
    openDeleteModal.value = true
}
async function confirmDelete() {
    if (!selectedPosition.value) return
    formLoading.value = true
    await positionStore.deletePosition(selectedPosition.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await positionStore.list()
}
async function onSubmitCreate() {
    formLoading.value = true
    await positionStore.create({
        ...formState.value,
        id: workspaceId.value
    })
    openCreateModal.value = false
    formLoading.value = false
    await positionStore.list()
}
async function onSubmitEdit() {
    formLoading.value = true
    await positionStore.update({
        ...formState.value,
        id: selectedPosition.value!.id
    })
    openEditModal.value = false
    formLoading.value = false
    await positionStore.list()
}
watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = {
            ...formState.value,
            name: ''
        }
        selectedPosition.value = null
    }
})
</script>
