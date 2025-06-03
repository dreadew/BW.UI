<template>
    <div>
        <UiHeading size="2xl" class="mb-6">Рабочие пространства</UiHeading>
        <div class="flex items-center gap-4 mb-4">
            <UInput v-model="search" placeholder="Поиск по названию..." class="w-64" />
            <UButton color="primary" @click="openCreateModal = true">Создать рабочее пространство</UButton>
        </div>
        <div v-if="filteredWorkspaces.length === 0" class="flex justify-center items-center h-64">
            <UCard class="w-full flex flex-col items-center justify-center p-8">
                <UIcon name="i-lucide-folder-open" class="text-4xl text-primary mb-2" />
                <UiHeading size="lg">Нет рабочих пространств</UiHeading>
                <UiText color="neutral" class="mt-2">Создайте первое рабочее пространство, чтобы начать работу!</UiText>
            </UCard>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <UCard v-for="ws in filteredWorkspaces" :key="ws.id" class="flex flex-col justify-between">
                <div>
                    <UiHeading size="lg">{{ ws.name }}</UiHeading>
                    <div class="text-xs text-gray-400 mt-1">ID: {{ ws.id }}</div>
                    <div class="text-xs text-gray-400 mt-1">Создано: {{ ws.createdAt }}</div>
                </div>
                <div class="flex gap-2 mt-4">
                    <NuxtLink :to="`/workspace/${ws.id}`">
                        <UButton size="sm" color="primary">Открыть</UButton>
                    </NuxtLink>
                    <UButton size="sm" color="error" variant="soft" @click="onDelete(ws)">Удалить</UButton>
                </div>
            </UCard>
        </div>
        <div class="flex gap-2 mt-4">
            <UButton size="xs" :disabled="offset === 0" @click="prevPage">Назад</UButton>
            <UButton size="xs" :disabled="workspaces.length < limit" @click="nextPage">Вперёд</UButton>
        </div>
        <UModal v-model:open="openCreateModal" title="Создать рабочее пространство">
            <template #body>
                <UForm :state="formState" :schema="createFormSchema" @submit="onSubmitCreate">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название рабочего пространства" />
                    </UFormField>
                    <UButton type="submit" color="primary" class="mt-4" :loading="formLoading">Сохранить</UButton>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление рабочего пространства">
            <template #body>
                <UiText color="error">Вы уверены, что хотите удалить рабочее пространство "{{ selectedWorkspace?.name
                }}"?</UiText>
            </template>
            <template #footer>
                <UButton color="neutral" @click="openDeleteModal = false">Отмена</UButton>
                <UButton color="error" @click="confirmDelete" :loading="formLoading">Удалить</UButton>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'workspace' })
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '~/stores/useWorkspaceStore'
import { createWorkspaceRequestSchema } from '~/schemas/generated.schema'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'
import type { Workspace } from '~/types/response.types'
useHead({ title: 'Рабочие пространства' })
const workspaceStore = useWorkspaceStore()
const { workspaces } = storeToRefs(workspaceStore)
const search = ref('')
const openCreateModal = ref(false)
const openDeleteModal = ref(false)
const selectedWorkspace = ref<any>(null)
const formState = ref<any>({ name: '' })
const formLoading = ref(false)
const createFormSchema = createWorkspaceRequestSchema;
const limit = ref(20)
const offset = ref(0)
const { user } = useUserStore();
const columns = [
    { accessorKey: 'id', header: 'ID', cell: ({ row }) => row.original.id },
    { accessorKey: 'name', header: 'Название', cell: ({ row }) => row.original.name },
    { accessorKey: 'createdAt', header: 'Дата создания', cell: ({ row }) => row.original.createdAt },
    { accessorKey: 'updatedAt', header: 'Дата обновления', cell: ({ row }) => row.original.updatedAt },
    { id: 'actions', header: 'Действия', cell: undefined }
]
const filteredWorkspaces = computed(() => {
    let data = workspaces.value
    if (search.value) {
        data = data.filter(w => w.name.toLowerCase().includes(search.value.toLowerCase()))
    }
    return data
})
function onDelete(workspace: Workspace) {
    selectedWorkspace.value = workspace
    openDeleteModal.value = true
}
async function confirmDelete() {
    if (!selectedWorkspace.value) return
    formLoading.value = true
    await workspaceStore.deleteWorkspace(selectedWorkspace.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await workspaceStore.list()
}
async function onSubmitCreate() {
    formLoading.value = true
    await workspaceStore.create({ 
        ...formState.value,
        userId: user.id
    })
    openCreateModal.value = false
    formLoading.value = false
    await workspaceStore.list()
}
async function fetchWorkspaces() {
    await workspaceStore.list({ limit: limit.value, offset: offset.value })
}

function nextPage() {
    offset.value += limit.value
    fetchWorkspaces()
}
function prevPage() {
    offset.value = Math.max(0, offset.value - limit.value)
    fetchWorkspaces()
}

watch([limit, offset], fetchWorkspaces)
watch([openCreateModal], ([create]) => {
    if (!create) {
        formState.value = { name: '' }
        selectedWorkspace.value = null
    }
})
watchEffect(async () => {
    await workspaceStore.list();
});
</script>
