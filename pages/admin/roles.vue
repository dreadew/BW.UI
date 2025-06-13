<template>
    <div>
        <BaseGrid :store="roleStore" :columns="columns" editable show-include-deleted @create="openCreateModal = true"
            @edit="(item) => onEdit(item as RoleDto)" @delete="item => onDelete(item as RoleDto)">
            <template #title>
                Роли
            </template>
        </BaseGrid>
        <UModal v-model:open="openCreateModal" title="Создать роль">
            <template #body>
                <UForm :state="formState" @submit="onSubmitCreate">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название роли" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="button" color="neutral" variant="ghost" @click="openCreateModal = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" variant="solid" :loading="formLoading">Создать</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openEditModal" title="Редактировать роль">
            <template #body>
                <UForm :state="formState" @submit="onSubmitEdit">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название роли" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="button" color="neutral" variant="ghost" @click="openCreateModal = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" variant="solid" :loading="formLoading">Обновить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление роли">
            <template #body>
                <UiText color="darker-neutral">Вы уверены, что хотите удалить роль <b>"{{ selectedRole?.name }}"</b>?
                </UiText>
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
import { ref, watch } from 'vue'
import { useRoleStore } from '~/stores/useRoleStore'
import { DateUtils } from '~/utils/date.utils'
import type { CreateRoleRequest, RoleDto } from '~/types/request.types'
import type { TableRow } from '@nuxt/ui'
useHead({ title: 'Роли' })

const roleStore = useRoleStore()

const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const selectedRole = ref<RoleDto | null>(null)
const formState = ref<CreateRoleRequest>({ name: '' })
const formLoading = ref(false)

const columns = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }: { row: TableRow<RoleDto> }) => row.original.id
    },
    {
        accessorKey: 'name',
        header: 'Название',
        cell: ({ row }: { row: TableRow<RoleDto> }) => row.original.name
    },
    {
        accessorKey: 'createdAt',
        header: 'Дата создания',
        cell: ({ row }: { row: TableRow<RoleDto> }) => row.original.createdAt ? new Date(DateUtils.deserialize(row.original.createdAt)!).toLocaleString() : ''
    },
    {
        accessorKey: 'updatedAt',
        header: 'Дата обновления',
        cell: ({ row }: { row: TableRow<RoleDto> }) => row.original.updatedAt ? new Date(DateUtils.deserialize(row.original.updatedAt)!).toLocaleString() : 'Отсутствует'
    },
    {
        id: 'action',
    }
]

function onEdit(role: RoleDto) {
    selectedRole.value = role
    formState.value = { name: role.name }
    openEditModal.value = true
}

function onDelete(role: RoleDto) {
    selectedRole.value = role
    openDeleteModal.value = true
}

async function confirmDelete() {
    if (!selectedRole.value) return
    formLoading.value = true
    await roleStore.deleteRole(selectedRole.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await roleStore.list()
}

async function onSubmitCreate() {
    formLoading.value = true
    await roleStore.create(formState.value)
    openCreateModal.value = false
    formLoading.value = false
    await roleStore.list()
}

async function onSubmitEdit() {
    formLoading.value = true
    await roleStore.update({
        ...formState.value,
        id: selectedRole.value?.id || ''
    })
    openEditModal.value = false
    formLoading.value = false
    await roleStore.list()
}

watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = { name: '' }
        selectedRole.value = null
    }
})
</script>
