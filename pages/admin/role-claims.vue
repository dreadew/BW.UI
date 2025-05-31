<template>
    <div>
        <UiHeading size="2xl" class="mb-6">Клеймы ролей</UiHeading>
        <div class="flex items-center gap-4 mb-4">
            <UInput v-model="search" placeholder="Поиск по значению..." class="w-64" />
            <UButton color="primary" @click="openCreateModal = true">Создать клейм</UButton>
        </div>
        <UTable :data="filteredAndSortedClaims" :columns="columns" class="w-full">
            <template #cell(actions)="{ row }">
                <UButton size="sm" variant="soft" color="primary" @click="onEdit(row.original)">Редактировать</UButton>
                <UButton size="sm" variant="soft" color="danger" class="ml-2" @click="onDelete(row.original)">Удалить
                </UButton>
            </template>
        </UTable>
        <!-- Create Modal -->
        <UModal v-model:open="openCreateModal" title="Создать клейм">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Создать клейм</span>
                    <UButton icon="i-lucide-x" color="gray" variant="ghost" @click="openCreateModal = false"
                        size="sm" />
                </div>
            </template>
            <template #body>
                <UForm :state="formState" :schema="createFormSchema" @submit="onSubmitCreate">
                    <UFormField label="Значение" name="value" required>
                        <UInput v-model="formState.value" required placeholder="Значение клейма" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Создать</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <!-- Edit Modal -->
        <UModal v-model:open="openEditModal" title="Редактировать клейм">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Редактировать клейм</span>
                    <UButton icon="i-lucide-x" color="gray" variant="ghost" @click="openEditModal = false" size="sm" />
                </div>
            </template>
            <template #body>
                <UForm :state="formState" :schema="editFormSchema" @submit="onSubmitEdit">
                    <UFormField label="Значение" name="value" required>
                        <UInput v-model="formState.value" required placeholder="Значение клейма" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Сохранить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <!-- Delete Confirmation Modal -->
        <UModal v-model:open="openDeleteModal" title="Удаление клейма">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Удаление клейма</span>
                    <UButton icon="i-lucide-x" color="gray" variant="ghost" @click="openDeleteModal = false"
                        size="sm" />
                </div>
            </template>
            <template #body>
                <UiText color="danger">Вы уверены, что хотите удалить клейм "{{ selectedClaim?.value }}"?</UiText>
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
import { useRoleClaimStore } from '~/stores/useRoleClaimStore'
import { createUserRoleClaimsRequestSchema, updateUserRoleClaimsRequestSchema } from '~/schemas/generated.schema'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'

const claimStore = useRoleClaimStore()
const { roleClaims, isLoading } = storeToRefs(claimStore)
const search = ref('')
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const selectedClaim = ref<any>(null)
const formState = ref<any>({ value: '' })
const formLoading = ref(false)
const createFormSchema = createUserRoleClaimsRequestSchema;
const editFormSchema = updateUserRoleClaimsRequestSchema;
const columns = [
    { accessorKey: 'id', header: 'ID', cell: ({ row }) => row.original.id },
    { accessorKey: 'value', header: 'Значение', cell: ({ row }) => row.original.value },
    { accessorKey: 'createdAt', header: 'Дата создания', cell: ({ row }) => row.original.createdAt },
    { accessorKey: 'updatedAt', header: 'Дата обновления', cell: ({ row }) => row.original.updatedAt },
    { id: 'actions', header: 'Действия', cell: undefined }
]
const filteredAndSortedClaims = computed(() => {
    let data = roleClaims.value
    if (search.value) {
        data = data.filter(c => c.value.toLowerCase().includes(search.value.toLowerCase()))
    }
    return data
})
function onEdit(claim) {
    selectedClaim.value = claim
    formState.value = { id: claim.id, value: claim.value }
    openEditModal.value = true
}
function onDelete(claim) {
    selectedClaim.value = claim
    openDeleteModal.value = true
}
async function confirmDelete() {
    if (!selectedClaim.value) return
    formLoading.value = true
    await claimStore.deleteRoleClaim(selectedClaim.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await claimStore.list()
}
async function onSubmitCreate() {
    formLoading.value = true
    await claimStore.createRoleClaim(formState.value)
    openCreateModal.value = false
    formLoading.value = false
    await claimStore.list()
}
async function onSubmitEdit() {
    formLoading.value = true
    await claimStore.updateRoleClaim(formState.value)
    openEditModal.value = false
    formLoading.value = false
    await claimStore.list()
}
watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = { value: '' }
        selectedClaim.value = null
    }
})
claimStore.list()
</script>
