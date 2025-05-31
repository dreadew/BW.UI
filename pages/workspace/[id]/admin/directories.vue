<template>
    <div>
        <UiHeading size="2xl" class="mb-6">Папки и файлы</UiHeading>
        <div class="flex items-center gap-4 mb-4">
            <UInput v-model="search" placeholder="Поиск по названию папки..." class="w-64" />
            <UButton color="primary" @click="openCreateModal = true">Создать папку</UButton>
        </div>
        <div v-if="treeData.length === 0" class="flex justify-center items-center h-64">
            <UCard class="flex flex-col items-center justify-center p-8">
                <UIcon name="i-lucide-folder-open" class="text-4xl text-primary mb-2" />
                <UiHeading size="lg">Нет папок</UiHeading>
                <UiText class="text-gray-500 mt-2">Создайте первую папку для хранения файлов и артефактов.</UiText>
            </UCard>
        </div>
        <UTree v-else :items="treeData" class="mb-6">
            <template #default="{ item }">
                <div class="flex items-center gap-2">
                    <span>{{ item.name }}</span>
                    <template v-if="item.artifacts">
                        <span v-for="artifact in item.artifacts" :key="artifact.id" class="ml-2">
                            <ULink :to="artifact.downloadUrl" target="_blank" class="text-primary underline flex items-center gap-1">
                                <UIcon name="i-lucide-download" />
                                {{ artifact.name }}
                            </ULink>
                            <span class="text-xs text-gray-400">({{ artifact.size }} байт)</span>
                        </span>
                    </template>
                </div>
            </template>
        </UTree>
        <!-- Create Modal -->
        <UModal v-model:open="openCreateModal" title="Создать папку">
            <template #body>
                <UForm :state="formState" :schema="createFormSchema" @submit="onSubmitCreate">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название папки" />
                    </UFormField>
                    <UButton type="submit" color="primary" class="mt-4" :loading="formLoading">Сохранить</UButton>
                </UForm>
            </template>
        </UModal>
        <!-- Edit Modal -->
        <UModal v-model:open="openEditModal" title="Редактировать папку">
            <template #body>
                <UForm :state="formState" :schema="editFormSchema" @submit="onSubmitEdit">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название папки" />
                    </UFormField>
                    <UButton type="submit" color="primary" class="mt-4" :loading="formLoading">Сохранить</UButton>
                </UForm>
            </template>
        </UModal>
        <!-- Delete Confirmation Modal -->
        <UModal v-model:open="openDeleteModal" title="Удаление папки">
            <template #body>
                <UiText color="danger">Вы уверены, что хотите удалить папку "{{ selectedDirectory?.name }}"?</UiText>
            </template>
            <template #footer>
                <UButton color="gray" @click="openDeleteModal = false">Отмена</UButton>
                <UButton color="danger" @click="confirmDelete" :loading="formLoading">Удалить</UButton>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'workspace' })
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWorkspaceDirectoryStore } from '~/stores/useWorkspaceDirectoryStore'
import { createWorkspaceDirectoryRequestSchema, updateWorkspaceDirectoryRequestSchema } from '~/schemas/generated.schema'
import { toTypedSchema } from '@vee-validate/zod'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'

const route = useRoute()
const workspaceId = computed(() => route.params.id as string)
const directoryStore = useWorkspaceDirectoryStore()
const { directories, isLoading } = storeToRefs(directoryStore)
const search = ref('')
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const selectedDirectory = ref<any>(null)
const formState = ref<any>({ name: '' })
const formLoading = ref(false)
const createFormSchema = toTypedSchema(createWorkspaceDirectoryRequestSchema)
const editFormSchema = toTypedSchema(updateWorkspaceDirectoryRequestSchema)
const treeData = computed(() => {
    let data = directories.value
    if (search.value) {
        data = data.filter(d => d.name.toLowerCase().includes(search.value.toLowerCase()))
    }
    // Преобразуем в формат дерева, если есть вложенность (пример для flat списка)
    return data.map(d => ({
        ...d,
        children: [], // если появится вложенность, сюда можно добавить дочерние папки
        artifacts: d.artifacts || []
    }))
})
function onEdit(directory) {
    selectedDirectory.value = directory
    formState.value = { id: directory.id, name: directory.name }
    openEditModal.value = true
}
function onDelete(directory) {
    selectedDirectory.value = directory
    openDeleteModal.value = true
}
async function confirmDelete() {
    if (!selectedDirectory.value) return
    formLoading.value = true
    await directoryStore.deleteDirectory(selectedDirectory.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await directoryStore.list(workspaceId.value)
}
async function onSubmitCreate() {
    formLoading.value = true
    await directoryStore.create({ ...formState.value, workspaceId: workspaceId.value })
    openCreateModal.value = false
    formLoading.value = false
    await directoryStore.list(workspaceId.value)
}
async function onSubmitEdit() {
    formLoading.value = true
    await directoryStore.update(selectedDirectory.value.id, { ...formState.value })
    openEditModal.value = false
    formLoading.value = false
    await directoryStore.list(workspaceId.value)
}
watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = { name: '' }
        selectedDirectory.value = null
    }
})
watch(workspaceId, (id) => {
    if (id) directoryStore.list(id)
}, { immediate: true })
</script>
