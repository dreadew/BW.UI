<template>
  <div class="p-4">
    <BaseGrid :store="roleStore" :columns="columns" editable show-include-deleted @create="openCreateModal = true"
      without-heading @edit="(item) => onEdit(item as ProjectRoleDto)"
      @delete="(item) => onDelete(item as ProjectRoleDto)">
    </BaseGrid>
    <UModal v-model:open="openCreateModal" title="Создать роль">
      <template #body>
        <UForm :state="formState" @submit="onSubmitCreate">
          <UFormField label="Название" name="name" required>
            <UInput v-model="formState.name" required placeholder="Название роли" class="w-full" />
          </UFormField>
          <div class="flex gap-2 justify-end mt-4">
            <UButton type="button" color="neutral" variant="ghost" @click="openCreateModal = false">Отмена</UButton>
            <UButton type="submit" color="primary" variant="solid" :loading="formLoading">Создать</UButton>
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
          <UCheckboxGroup v-model="checkedClaims" :disabled="claimLoading" :items="PROJECT_ROLE_CLAIMS" variant="table"
            legend="Права" @update:modelValue="onClaimChange" />
          <div class="flex gap-2 justify-end mt-4">
            <UButton type="button" color="neutral" variant="ghost" @click="openEditModal = false">Отмена</UButton>
            <UButton type="submit" color="primary" variant="solid" :loading="formLoading">Сохранить</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openDeleteModal" title="Удалить роль?">
      <template #body>
        <UiText color="darker-neutral">Вы уверены, что хотите удалить роль <b>{{ selectedRole?.name }}</b>?</UiText>
      </template>
      <template #footer>
        <div class="w-full flex justify-end gap-2">
          <UButton color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена</UButton>
          <UButton color="primary" @click="confirmDelete" :loading="formLoading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useProjectRoleStore } from '~/stores/useProjectRoleStore'
import type { ProjectRoleDto, CreateProjectRoleRequest, UpdateProjectRoleRequest } from '~/types/request.types'
import type { AcceptableValue, TableRow } from '@nuxt/ui'
import { PROJECT_ROLE_CLAIMS } from '~/constants/roleClaims.constants'
import { useProjectRoleClaimsStore } from '~/stores/useProjectRoleClaimsStore'

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const roleStore = useProjectRoleStore()
roleStore.projectId = projectId.value

const columns = [
  { accessorKey: 'name', header: 'Название', cell: ({ row }: { row: TableRow<ProjectRoleDto> }) => row.original.name },
  {
    accessorKey: 'createdAt',
    header: 'Дата создания',
    cell: ({ row }: { row: TableRow<ProjectRoleDto> }) => row.original.createdAt ? new Date(DateUtils.deserialize(row.original.createdAt)!).toLocaleString() : '',
    enableSorting: true
  },
  {
    accessorKey: 'updatedAt',
    header: 'Дата обновления',
    cell: ({ row }: { row: TableRow<ProjectRoleDto> }) => row.original.updatedAt ? new Date(DateUtils.deserialize(row.original.updatedAt)!).toLocaleString() : 'Отсутствует',
    enableSorting: true
  },
  { id: 'action', header: 'Действия', cell: undefined }
]

const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const formState = ref<CreateProjectRoleRequest | UpdateProjectRoleRequest>({ id: projectId.value, name: '' })
const formLoading = ref(false)
const selectedRole = ref<ProjectRoleDto | null>(null)
const claimsStore = useProjectRoleClaimsStore()
const claimLoading = ref(false)
const checkedClaims = ref<string[]>([])

function onEdit(role: ProjectRoleDto) {
  selectedRole.value = role
  formState.value = { id: role.id, name: role.name }
  openEditModal.value = true
}

function onDelete(role: ProjectRoleDto) {
  selectedRole.value = role
  openDeleteModal.value = true
}

async function onSubmitCreate() {
  formLoading.value = true
  await roleStore.create({ ...formState.value, name: formState.value.name })
  openCreateModal.value = false
  formLoading.value = false
  await roleStore.list()
}

async function onSubmitEdit() {
  if (!selectedRole.value) return
  formLoading.value = true
  await roleStore.update({ id: selectedRole.value.id, name: formState.value.name })
  openEditModal.value = false
  formLoading.value = false
  await roleStore.list()
}

async function confirmDelete() {
  if (!selectedRole.value) return
  formLoading.value = true
  await roleStore.deleteRole(selectedRole.value.id)
  openDeleteModal.value = false
  formLoading.value = false
  await roleStore.list()
}

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
  claimLoading.value = true
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

watch(() => projectId.value, (id) => {
  if (id) roleStore.list()
})

watch([openCreateModal, openEditModal], ([create, edit]) => {
  if (!create && !edit) {
    formState.value = { ...formState.value, name: '' }
    selectedRole.value = null
  }
})
</script>
