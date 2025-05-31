<template>
    <div>
        <UiHeading size="2xl" class="mb-6">Должности рабочего пространства</UiHeading>
        <div class="flex items-center gap-4 mb-4">
            <UInput v-model="search" placeholder="Поиск по названию..." class="w-64" />
            <UButton color="primary" @click="openCreateModal = true">Создать должность</UButton>
        </div>
        <UTable :data="filteredAndSortedPositions" :columns="columns" class="w-full">
            <template #cell(actions)="{ row }">
                <UButton size="sm" variant="soft" color="primary" @click="onEdit(row.original)">Редактировать</UButton>
                <UButton size="sm" variant="soft" color="danger" class="ml-2" @click="onDelete(row.original)">Удалить
                </UButton>
            </template>
        </UTable>
        <!-- Create Modal -->
        <UModal v-model:open="openCreateModal" title="Создать должность">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Создать должность</span>
                    <UButton icon="i-lucide-x" color="gray" variant="ghost" @click="openCreateModal = false"
                        size="sm" />
                </div>
            </template>
            <template #body>
                <UForm :state="formState" :schema="createFormSchema" @submit="onSubmitCreate">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название должности" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Создать</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <!-- Edit Modal -->
        <UModal v-model:open="openEditModal" title="Редактировать должность">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Редактировать должность</span>
                    <UButton icon="i-lucide-x" color="gray" variant="ghost" @click="openEditModal = false" size="sm" />
                </div>
            </template>
            <template #body>
                <UForm :state="formState" :schema="editFormSchema" @submit="onSubmitEdit">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название должности" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Сохранить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <!-- Delete Confirmation Modal -->
        <UModal v-model:open="openDeleteModal" title="Удаление должности">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Удаление должности</span>
                    <UButton icon="i-lucide-x" color="gray" variant="ghost" @click="openDeleteModal = false"
                        size="sm" />
                </div>
            </template>
            <template #body>
                <UiText color="danger">Вы уверены, что хотите удалить должность "{{ selectedPosition?.name }}"?</UiText>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton color="gray" @click="openDeleteModal = false">Отмена</UButton>
                    <UButton color="danger" @click="confirmDelete" :loading="formLoading">Удалить</UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useWorkspacePositionStore } from '~/stores/useWorkspacePositionStore'
import { createWorkspacePositionRequestSchema, updateWorkspacePositionRequestSchema } from '~/schemas/generated.schema'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'

const route = useRoute()
const workspaceId = computed(() => route.params.id as string)
const positionStore = useWorkspacePositionStore()
const { positions, isLoading } = storeToRefs(positionStore)
const search = ref('')
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const selectedPosition = ref<any>(null)
const formState = ref<any>({ name: '' })
const formLoading = ref(false)
const createFormSchema = createWorkspacePositionRequestSchema;
const editFormSchema = updateWorkspacePositionRequestSchema;
const columns = [
    { accessorKey: 'id', header: 'ID', cell: ({ row }) => row.original.id },
    { accessorKey: 'name', header: 'Название', cell: ({ row }) => row.original.name },
    { accessorKey: 'createdAt', header: 'Дата создания', cell: ({ row }) => row.original.createdAt },
    { accessorKey: 'updatedAt', header: 'Дата обновления', cell: ({ row }) => row.original.updatedAt },
    { id: 'actions', header: 'Действия', cell: undefined }
]
const filteredAndSortedPositions = computed(() => {
    let data = positions.value
    if (search.value) {
        data = data.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))
    }
    return data
})
function onEdit(position) {
    selectedPosition.value = position
    formState.value = { id: position.id, name: position.name }
    openEditModal.value = true
}
function onDelete(position) {
    selectedPosition.value = position
    openDeleteModal.value = true
}
async function confirmDelete() {
    if (!selectedPosition.value) return
    formLoading.value = true
    await positionStore.deleteWorkspacePosition(selectedPosition.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await positionStore.list(workspaceId.value)
}
async function onSubmitCreate() {
    formLoading.value = true
    await positionStore.create({ ...formState.value, workspaceId: workspaceId.value })
    openCreateModal.value = false
    formLoading.value = false
    await positionStore.list(workspaceId.value)
}
async function onSubmitEdit() {
    formLoading.value = true
    await positionStore.update(selectedPosition.value.id, { ...formState.value })
    openEditModal.value = false
    formLoading.value = false
    await positionStore.list(workspaceId.value)
}
watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = { name: '' }
        selectedPosition.value = null
    }
})
watch(workspaceId, (id) => {
    if (id) positionStore.list(id)
}, { immediate: true })
</script>
