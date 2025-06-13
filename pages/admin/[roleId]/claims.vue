<template>
    <div>
        <BaseGrid :store="claimStore" :columns="columns" @create="openCreateModal = true"
            @delete="(item) => onDelete(item as RoleClaimsDto)">
            <template #title>
                Клеймы
            </template>
        </BaseGrid>
        <UModal v-model:open="openCreateModal" title="Создать клейм">
            <template #body>
                <UForm class="space-y-4" :state="formState" @submit="onSubmitCreate">
                    <UFormField label="Тип клейма" name="value" required>
                        <UInput v-model="formState.claimType" required placeholder="Значение клейма" class="w-full" />
                    </UFormField>
                    <UFormField label="Значение" name="value" required>
                        <UInput v-model="formState.claimValue" required placeholder="Значение клейма" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="button" color="neutral" variant="ghost" @click="openCreateModal = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" variant="solid" :loading="formLoading">Создать</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление клейма">
            <template #body>
                <UiText color="darker-neutral">Вы уверены, что хотите удалить клейм <b>"{{ selectedClaim?.claimType
                }}.{{ selectedClaim?.claimValue }}"</b>?</UiText>
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
import { ref, computed } from 'vue'
import { useRoleClaimStore } from '~/stores/useRoleClaimStore'
import type { CreateRoleClaimsRequest, RoleClaimsDto } from '~/types/request.types'
import type { TableRow } from '@nuxt/ui'

const route = useRoute()
const roleId = computed(() => route.params.roleId as string)
const claimStore = useRoleClaimStore()
claimStore.roleId = roleId.value
const openCreateModal = ref(false)
const openDeleteModal = ref(false)
const selectedClaim = ref<RoleClaimsDto | null>(null)
const formState = ref<CreateRoleClaimsRequest>({
    roleId: roleId.value,
    claimType: '',
    claimValue: ''
})
const formLoading = ref(false)
const columns = [
    { accessorKey: 'value', header: 'Значение', cell: ({ row }: { row: TableRow<RoleClaimsDto> }) => `${row.original.claimValue}.${row.original.claimType}` },
    { id: 'action' }
]
function onDelete(claim: RoleClaimsDto) {
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
</script>
