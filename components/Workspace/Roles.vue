<template>
    <div>
        <BaseGrid :store="roleStore" :columns="columns" editable show-include-deleted without-heading
            @create="openCreateModal = true" @edit="(item) => onEdit(item as WorkspaceRoleDto)"
            @delete="(item) => onDelete(item as WorkspaceRoleDto)"></BaseGrid>
        <UModal v-model:open="openCreateModal" title="Создать роль">
            <template #body>
                <UForm :state="formState" @submit="onSubmitCreate">
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
            <template #body>
                <UForm class="space-y-4" :state="formState" @submit="onSubmitEdit">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название роли" class="w-full" />
                    </UFormField>
                    <UCheckboxGroup v-model="checkedClaims" :disabled="claimLoading" :items="WORKSPACE_ROLE_CLAIMS"
                        variant="table" legend="Права" @update:modelValue="onClaimChange" />
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Сохранить</UButton>
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
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkspaceRoleStore } from '~/stores/useWorkspaceRoleStore'
import { WORKSPACE_ROLE_CLAIMS } from '~/constants/roleClaims.constants'
import { useWorkspaceRoleClaimsStore } from '~/stores/useWorkspaceRoleClaimsStore'
import type { CreateWorkspaceRoleRequest, WorkspaceRoleDto } from '~/types/request.types'
import type { AcceptableValue, TableRow } from '@nuxt/ui'
import { DateUtils } from '~/utils/date.utils'

useHead({ title: 'Роли рабочего пространства' })
const route = useRoute()
const workspaceId = computed(() => route.params.id as string)
const roleStore = useWorkspaceRoleStore()
roleStore.workspaceId = workspaceId.value
const claimsStore = useWorkspaceRoleClaimsStore()

const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const selectedRole = ref<WorkspaceRoleDto | null>(null)
const formState = ref<CreateWorkspaceRoleRequest>({ id: workspaceId.value, name: '' })
const formLoading = ref(false)
const claimLoading = ref(false)
const checkedClaims = ref<string[]>([])

const columns = [
    { accessorKey: 'name', header: 'Название', cell: ({ row }: { row: TableRow<WorkspaceRoleDto> }) => row.original.name },
    {
        accessorKey: 'createdAt',
        header: 'Дата создания',
        cell: ({ row }: { row: TableRow<WorkspaceRoleDto> }) => row.original.createdAt ? DateUtils.deserialize(row.original.createdAt)?.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
        enableSorting: true
    },
    {
        accessorKey: 'updatedAt',
        header: 'Дата обновления',
        cell: ({ row }: { row: TableRow<WorkspaceRoleDto> }) => row.original.updatedAt ? DateUtils.deserialize(row.original.updatedAt)?.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Отсутствует',
        enableSorting: true
    },
    { id: 'action', header: 'Действия', cell: undefined }
]

function onEdit(role: WorkspaceRoleDto) {
    selectedRole.value = role
    formState.value = { id: role.id, name: role.name }
    openEditModal.value = true
}

function onDelete(role: WorkspaceRoleDto) {
    selectedRole.value = role
    openDeleteModal.value = true
}

async function confirmDelete() {
    if (!selectedRole.value) return
    formLoading.value = true
    await roleStore.deleteWorkspaceRole(selectedRole.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await roleStore.list()
}

async function onSubmitCreate() {
    formLoading.value = true
    await roleStore.create({ ...formState.value })
    openCreateModal.value = false
    formLoading.value = false
    await roleStore.list()
}

async function onSubmitEdit() {
    formLoading.value = true
    await roleStore.update({ ...formState.value })
    openEditModal.value = false
    formLoading.value = false
    await roleStore.list()
}

watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = { ...formState.value, name: '' }
        selectedRole.value = null
    }
})

watch(selectedRole, async (role) => {
    if (role) {
        claimsStore.roleId = role.id
        await claimsStore.list()
        checkedClaims.value = claimsStore.data.map(c => c.value)
    } else {
        checkedClaims.value = []
    }
})

async function onClaimChange(val: AcceptableValue[]) {
    if (!selectedRole.value) return
    const filtered = val.filter((v): v is string => typeof v === 'string' && !!v)
    for (const claim of filtered) {
        if (!claimsStore.data.some(c => c.value === claim)) {
            await claimsStore.create({ id: selectedRole.value.id, value: claim })
        }
    }
    for (const claim of claimsStore.data.map(c => c.value)) {
        if (!filtered.includes(claim)) {
            const c = claimsStore.data.find(x => x.value === claim)
            if (c) await claimsStore.deleteClaim(c.id)
        }
    }
    await claimsStore.list()
    checkedClaims.value = claimsStore.data.map(c => c.value)
    claimLoading.value = false
}
</script>
