<template>
  <div>
    <BaseDataGrid :data="users" :columns="columns" without-heading @create="openCreateModal = true" @edit="onEdit"
      @delete="onDelete"></BaseDataGrid>
    <UModal v-model:open="openCreateModal" title="Добавить пользователя">
      <template #body>
        <UForm class="space-y-4" :state="formState" @submit="onSubmitCreate">
          <UFormField label="Пользователь" name="userId" required>
            <USelect :loading="userStore.loading" :disabled="userStore.loading" v-model="formState.userId"
              :items="userOptions" placeholder="Выберите пользователя" class="w-full" />
          </UFormField>
          <UFormField label="Роль" name="roleId" required>
            <USelect :loading="roleStore.loading" :disabled="roleStore.loading" v-model="formState.roleId"
              :items="roleOptions" placeholder="Выберите роль" class="w-full" />
          </UFormField>
          <UFormField label="Должность" name="positionId">
            <USelect :loading="positionStore.loading" :disabled="positionStore.loading" v-model="formState.positionId"
              :items="positionOptions" placeholder="Выберите должность (опционально)" class="w-full" />
          </UFormField>
          <div class="flex justify-end mt-4">
            <UButton type="submit" color="primary" :loading="formLoading">Пригласить</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openEditModal" title="Редактировать пользователя">
      <template #body>
        <UForm class="space-y-4" :state="formState" @submit="onSubmitEdit">
          <UFormField label="Роль" name="roleId" required>
            <USelect v-model="formState.roleId" :items="roleOptions" placeholder="Выберите роль" class="w-full" />
          </UFormField>
          <UFormField label="Должность" name="positionId">
            <USelect v-model="formState.positionId" :items="positionOptions"
              placeholder="Выберите должность (опционально)" class="w-full" />
          </UFormField>
          <div class="flex justify-end mt-4">
            <UButton type="submit" color="primary" :loading="formLoading">Сохранить</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openDeleteModal" title="Удаление пользователя">
      <template #body>
        <UiText color="darker-neutral">Вы уверены, что хотите удалить пользователя <b>"{{ selectedUser?.user?.username
          ||
          selectedUser?.user?.email }}"</b>?</UiText>
      </template>
      <template #footer>
        <div class="w-full flex justify-end gap-2">
          <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена
          </UButton>
          <UButton type="button" color="error" variant="solid" @click="confirmDelete" :loading="formLoading">Удалить
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { TableColumn, TableRow } from '@nuxt/ui'
import { useWorkspaceStore } from '~/stores/useWorkspaceStore'
import { useUserStore } from '~/stores/useUserStore'
import { useWorkspaceRoleStore } from '~/stores/useWorkspaceRoleStore'
import { useWorkspacePositionStore } from '~/stores/useWorkspacePositionStore'
import type { PositionDto, UserDto, WorkspaceRoleDto, WorkspaceUserDto, BaseDto, UpdateWorkspaceUserRequest } from '~/types/request.types'

useHead({ title: 'Пользователи рабочего пространства' })
const route = useRoute()
const workspaceId = computed(() => route.params.id as string)
const workspaceStore = useWorkspaceStore()
const userStore = useUserStore()
const roleStore = useWorkspaceRoleStore()
const positionStore = useWorkspacePositionStore()
roleStore.workspaceId = workspaceId.value
positionStore.workspaceId = workspaceId.value

const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const selectedUser = ref<WorkspaceUserDto | null>(null)
const formState = ref<UpdateWorkspaceUserRequest>({ id: workspaceId.value, userId: '', roleId: '', positionId: '' })
const formLoading = ref(false)

const users = computed<WorkspaceUserDto[]>(() => {
  const ws = workspaceStore.data.find(ws => ws.id === workspaceId.value)
  return ws?.users ?? []
})

const userOptions = ref<{ label: string, value: string }[]>([])
const roleOptions = ref<{ label: string, value: string }[]>([])
const positionOptions = ref<{ label: string, value: string }[]>([])

async function fetchSelectOptions() {
  await userStore.list()

  userOptions.value = userStore.data.map((u: UserDto) => ({
    label: u.username ? `${u.username} (${u.email})` : u.email,
    value: u.id
  }))

  await roleStore.list()
  roleOptions.value = roleStore.data.map((r: WorkspaceRoleDto) => ({
    label: r.name,
    value: r.id
  }))

  positionStore.workspaceId = workspaceId.value
  const positionList = await positionStore.list()
  positionOptions.value = (positionList || []).map((p: PositionDto) => ({
    label: p.name,
    value: p.id
  }))
}

watch([openCreateModal, openEditModal], ([create, edit]) => {
  if ((create || edit)) fetchSelectOptions()
  if (!create && !edit) {
    formState.value = { id: workspaceId.value, userId: '', roleId: '', positionId: '' }
    selectedUser.value = null
  }
})

const columns = [
  { accessorKey: 'username', header: 'Имя пользователя', cell: ({ row }: { row: TableRow<WorkspaceUserDto> }) => row.original.user?.username ?? '' },
  { accessorKey: 'email', header: 'Email', cell: ({ row }: { row: TableRow<WorkspaceUserDto> }) => row.original.user?.email ?? '' },
  { accessorKey: 'role', header: 'Роль', cell: ({ row }: { row: TableRow<WorkspaceUserDto> }) => row.original.role?.name ?? '' },
  { accessorKey: 'position', header: 'Должность', cell: ({ row }: { row: TableRow<WorkspaceUserDto> }) => row.original.position?.name ?? '' },
  { id: 'action' }
]

function onEdit(user: WorkspaceUserDto) {
  selectedUser.value = user
  formState.value = {
    ...formState.value,
    roleId: user.role?.id || '',
    positionId: user.position?.id || ''
  }
  openEditModal.value = true
}

function onDelete(user: WorkspaceUserDto) {
  selectedUser.value = user
  openDeleteModal.value = true
}

async function confirmDelete() {
  if (!selectedUser.value) return
  formLoading.value = true
  await workspaceStore.deleteUser({
    id: selectedUser.value.id,
    userId: selectedUser.value.user?.id
  })
  formLoading.value = false
  openDeleteModal.value = false
  await workspaceStore.list()
}

async function onSubmitCreate() {
  formLoading.value = true
  await workspaceStore.invite({
    id: workspaceId.value,
    userId: formState.value.userId
  })
  openCreateModal.value = false
  formLoading.value = false
  await workspaceStore.list()
}

async function onSubmitEdit() {
  if (!selectedUser.value) return
  formLoading.value = true
  await workspaceStore.updateUser(
    workspaceId.value,
    selectedUser.value.id,
    {
      id: selectedUser.value.id,
      userId: selectedUser.value.user?.id,
      roleId: formState.value.roleId,
      positionId: formState.value.positionId || undefined
    }
  )
  openEditModal.value = false
  formLoading.value = false
  await workspaceStore.list()
}
</script>
