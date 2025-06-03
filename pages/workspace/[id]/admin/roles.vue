<template>
    <div>
        <UiHeading size="2xl" class="mb-6">Роли рабочего пространства</UiHeading>
        <div class="flex items-center gap-4 mb-4">
            <UInput v-model="search" placeholder="Поиск по названию..." class="w-64" />
            <UButton color="primary" @click="openCreateModal = true">Создать роль</UButton>
        </div>
        <UTable :data="filteredAndSortedRoles" :columns="columns" class="w-full">
            <template #cell(actions)="{ row }">
                <UButton size="sm" variant="soft" color="primary" @click="onEdit(row.original)">Редактировать</UButton>
                <UButton size="sm" variant="soft" color="error" class="ml-2" @click="onDelete(row.original)">Удалить
                </UButton>
            </template>
        </UTable>
        <UModal v-model:open="openCreateModal" title="Создать роль">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Создать роль</span>
                    <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="openCreateModal = false"
                        size="sm" />
                </div>
            </template>
            <template #body>
                <UForm :state="formState" :schema="createFormSchema" @submit="onSubmitCreate">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название роли" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Создать</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openEditModal" title="Редактировать роль">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Редактировать роль</span>
                    <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="openEditModal = false" size="sm" />
                </div>
            </template>
            <template #body>
                <UForm :state="formState" :schema="editFormSchema" @submit="onSubmitEdit">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название роли" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Сохранить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление роли">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Удаление роли</span>
                    <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="openDeleteModal = false"
                        size="sm" />
                </div>
            </template>
            <template #body>
                <UiText color="error">Вы уверены, что хотите удалить роль "{{ selectedRole?.name }}"?</UiText>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton color="neutral" @click="openDeleteModal = false">Отмена</UButton>
                    <UButton color="error" @click="confirmDelete" :loading="formLoading">Удалить</UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useWorkspaceRoleStore } from '~/stores/useWorkspaceRoleStore'
import { createWorkspaceRoleRequestSchema, updateWorkspaceRoleRequestSchema } from '~/schemas/generated.schema'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'
import type { WorkspaceRole } from '~/types/response.types'
useHead({ title: 'Роли рабочего пространства' })
const route = useRoute()
const workspaceId = computed(() => route.params.id as string)
const roleStore = useWorkspaceRoleStore()
const { roles } = storeToRefs(roleStore)
const search = ref('')
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const selectedRole = ref<any>(null)
const formState = ref<any>({ name: '' })
const formLoading = ref(false)
const createFormSchema = createWorkspaceRoleRequestSchema;
const editFormSchema = updateWorkspaceRoleRequestSchema;
const columns = [
    { accessorKey: 'id', header: 'ID', cell: ({ row }) => row.original.id },
    { accessorKey: 'name', header: 'Название', cell: ({ row }) => row.original.name },
    { accessorKey: 'createdAt', header: 'Дата создания', cell: ({ row }) => row.original.createdAt },
    { accessorKey: 'updatedAt', header: 'Дата обновления', cell: ({ row }) => row.original.updatedAt },
    { id: 'actions', header: 'Действия', cell: undefined }
]
const filteredAndSortedRoles = computed(() => {
    let data = roles.value
    if (search.value) {
        data = data.filter(r => r.name.toLowerCase().includes(search.value.toLowerCase()))
    }
    return data
})
function onEdit(role: WorkspaceRole) {
    selectedRole.value = role
    formState.value = { id: role.id, name: role.name }
    openEditModal.value = true
}
function onDelete(role: WorkspaceRole) {
    selectedRole.value = role
    openDeleteModal.value = true
}
async function confirmDelete() {
    if (!selectedRole.value) return
    formLoading.value = true
    await roleStore.deleteWorkspaceRole(selectedRole.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await roleStore.list(workspaceId.value)
}
async function onSubmitCreate() {
    formLoading.value = true
    await roleStore.create({ ...formState.value, workspaceId: workspaceId.value })
    openCreateModal.value = false
    formLoading.value = false
    await roleStore.list(workspaceId.value)
}
async function onSubmitEdit() {
    formLoading.value = true
    await roleStore.update(selectedRole.value.id, { ...formState.value })
    openEditModal.value = false
    formLoading.value = false
    await roleStore.list(workspaceId.value)
}
watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = { name: '' }
        selectedRole.value = null
    }
})
watch(workspaceId, (id) => {
    if (id) roleStore.list(id)
})
</script>
