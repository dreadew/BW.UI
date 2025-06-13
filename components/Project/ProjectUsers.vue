<template>
    <div>
        <BaseDataGrid without-editing :data="usersWithId" :columns="columns" without-heading
            @create="openAddUser = true" @delete="onDeleteUser" />
        <UModal v-model:open="openAddUser" title="Добавить пользователя">
            <template #body>
                <UForm :state="userFormState" class="space-y-4" @submit="onAddUser">
                    <UFormField label="Пользователь" name="userId" required>
                        <USelect v-model="userFormState.userId" :items="userOptions" placeholder="Выберите пользователя"
                            class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary">Добавить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
import type { TableRow } from '@nuxt/ui'
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '~/stores/useProjectStore'
import { useUserStore } from '~/stores/useUserStore'
import type { ProjectUserDto } from '~/types/request.types'

const projectStore = useProjectStore()
const userStore = useUserStore()
const openAddUser = ref(false)
const userFormState = ref({ userId: '' })

const usersWithId = computed(() => {
    const users = projectStore.currentProject?.users ?? []
    return users.map(u => ({ ...u, id: u.userId }))
})

const columns = [
    { accessorKey: 'user.username', header: 'Имя пользователя', cell: ({ row }: { row: TableRow<ProjectUserDto> }) => row.original.user?.username ?? '' },
    { accessorKey: 'user.email', header: 'Email', cell: ({ row }: { row: TableRow<ProjectUserDto> }) => row.original.user?.email ?? '' },
    { accessorKey: 'role.name', header: 'Роль', cell: ({ row }: { row: TableRow<ProjectUserDto> }) => row.original.role?.name ?? '' },
    { id: 'action' }
]

const userOptions = computed(() =>
    userStore.data.map(u => ({ label: u.username ? `${u.username} (${u.email})` : u.email, value: u.id }))
)

async function onAddUser() {
    const projectId = projectStore.currentProject?.id
    if (!userFormState.value.userId || !projectId) return
    await projectStore.addUser({ id: projectId, userId: userFormState.value.userId })
    openAddUser.value = false
    userFormState.value.userId = ''
    await projectStore.get(projectId)
}

async function onDeleteUser(user: ProjectUserDto) {
    const projectId = projectStore.currentProject?.id
    if (!user?.userId || !projectId) return
    await projectStore.deleteUser({ id: projectId, userId: user.userId })
    await projectStore.get(projectId)
}

onMounted(() => {
    userStore.list()
    if (projectStore.currentProject?.id) {
        projectStore.get(projectStore.currentProject.id)
    }
})
</script>
