<template>
    <div>
        <BaseDataGrid without-editing :data="assignees" :columns="columns" without-heading
            @create="openCreateModal = true" @delete="onDelete" />
        <UModal v-model:open="openCreateModal" title="Добавить пользователя">
            <template #body>
                <UForm class="space-y-4" :state="formState" @submit="onSubmitCreate">
                    <UFormField label="Пользователь" name="userId" required>
                        <USelect :loading="userStore.loading" :disabled="userStore.loading" v-model="formState.userId"
                            :items="userOptions" placeholder="Выберите пользователя" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="taskStore.loading">Добавить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление пользователя">
            <template #body>
                <UiText color="darker-neutral">Вы уверены, что хотите удалить пользователя <b>"{{
                    selectedAssignee?.user?.username
                    ||
                    selectedAssignee?.user?.email }}"</b>?</UiText>
            </template>
            <template #footer>
                <div class="w-full flex justify-end gap-2">
                    <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена
                    </UButton>
                    <UButton type="button" color="error" variant="solid" @click="confirmDelete"
                        :loading="taskStore.loading">Удалить
                    </UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { TableRow } from '@nuxt/ui'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '~/stores/useTaskStore'
import { useUserStore } from '~/stores/useUserStore'
import type { AddTaskAssigneeRequest, TaskAssigneeDto } from '~/types/request.types'

const route = useRoute()
const taskId = computed(() => route.params.taskId as string)
const taskStore = useTaskStore()
const userStore = useUserStore()
const task = await taskStore.get(taskId.value)

const assignees = computed<TaskAssigneeDto[]>(() => {
    return task?.assignees ?? []
})

const selectedAssignee = ref<TaskAssigneeDto | null>(null)

const formState = ref<AddTaskAssigneeRequest>({ id: taskId.value, userId: '' })
const formLoading = ref(false)
const openCreateModal = ref(false)
const openDeleteModal = ref(false)

const userOptions = computed(() => {
    const assignedIds = new Set(assignees.value.map(a => a.userId))
    return userStore.data
        .filter(u => !assignedIds.has(u.id))
        .map(u => ({ label: u.username ? `${u.username} (${u.email})` : u.email, value: u.id }))
})

const columns = [
    { accessorKey: 'username', header: 'Имя пользователя', cell: ({ row }: { row: TableRow<TaskAssigneeDto> }) => row.original.user?.username ?? '' },
    { accessorKey: 'email', header: 'Email', cell: ({ row }: { row: TableRow<TaskAssigneeDto> }) => row.original.user?.email ?? '' },
    { id: 'action' }
]

function onDelete(assignee: TaskAssigneeDto) {
    selectedAssignee.value = assignee
    openDeleteModal.value = true
}

async function confirmDelete() {
    if (!selectedAssignee.value) return
    formLoading.value = true
    await taskStore.removeTaskAssignee({
        id: taskId.value,
        userId: selectedAssignee.value.user?.id
    })
    formLoading.value = false
    openDeleteModal.value = false
}

async function onSubmitCreate() {
    formLoading.value = true
    await taskStore.addTaskAssignee({
        id: taskId.value,
        userId: formState.value.userId
    })
    openCreateModal.value = false
    formLoading.value = false
}

onMounted(() => {
    userStore.list()
})
</script>
