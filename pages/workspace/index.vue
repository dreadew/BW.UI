<template>
    <div>
        <!-- <UiHeading size="2xl" class="mb-6">Рабочие пространства</UiHeading>
        <div class="flex items-center justify-between gap-4 mb-4">
            <UButton color="primary" @click="openCreateModal = true">Создать</UButton>
            <div class="flex items-center gap-3">
                <UCheckbox v-model="workspaceStore.includeDeleted" label="Показывать удаленные" />
                <UInput v-model="search" placeholder="Поиск по значению..." class="w-64" />
            </div>
        </div>

        <div v-if="workspaceStore.loading" class="flex justify-center items-center">
            <USkeleton class="w-full h-96 mt-2" />
        </div>

        <BaseEmpty v-if="!workspaceStore.loading && filteredWorkspaces?.length === 0" />

        <div v-if="!workspaceStore.loading && filteredWorkspaces?.length > 0" class="flex items-center flex-wrap gap-6">
            <BaseCard v-for="ws in filteredWorkspaces" :key="ws.id" :entity="ws" :title="ws.name" :image="ws.path"
                :date="DateUtils.deserialize(ws.createdAt)?.toLocaleDateString()">
                <template #actions>
                    <div class="flex items-center gap-2">
                        <UButton size="sm" variant="ghost" color="primary" @click="onEdit(ws)"
                            icon="i-heroicons-pencil" />
                        <UButton size="sm" variant="ghost" color="error" @click="onDelete(ws)"
                            icon="i-heroicons-trash" />
                    </div>
                    <NuxtLink :to="`/workspace/${ws.id}`">
                        <UButton size="sm" color="primary">Перейти</UButton>
                    </NuxtLink>
                </template>
</BaseCard>
</div> -->

        <BaseCardLayout :store="workspaceStore" type="workspace" title="Рабочие пространства"
            @open-create="openCreateModal = true" @open-edit="onEdit" @open-delete="onDelete"
            @open-restore="onRestore" />

        <UModal v-model:open="openCreateModal" title="Создать рабочее пространство">
            <template #body>
                <UForm :state="formState" @submit="onSubmitCreate">
                    <UFormField label="Название" name="name" required>
                        <UInput class="w-full" v-model="formState.name" required
                            placeholder="Название рабочего пространства" />
                    </UFormField>
                    <div class="flex justify-end gap-2 mt-4">
                        <UButton type="button" color="neutral" variant="ghost" @click="openCreateModal = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" variant="solid" :loading="formLoading">Создать</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление рабочего пространства">
            <template #body>
                <UiText color="darker-neutral">Вы уверены, что хотите удалить рабочее пространство <b>"{{
                    selectedWorkspace?.name }}"</b>?</UiText>
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

        <UModal v-model:open="openEditModal" title="Редактировать рабочее пространство">
            <template #body>
                <UForm :state="formState" @submit="onSubmitEdit">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Сохранить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>

        <UModal v-model:open="openRestoreModal" title="Восстановление рабочего пространства">
            <template #body>
                <UiText color="darker-neutral">Вы уверены, что хотите восстановить рабочее пространство <b>"{{
                    selectedWorkspace?.name }}"</b>?
                </UiText>
            </template>
            <template #footer>
                <div class="w-full flex justify-end gap-2">
                    <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена
                    </UButton>
                    <UButton type="button" color="secondary" variant="solid" @click="confirmRestore"
                        :loading="formLoading">
                        Восстановить
                    </UButton>
                </div>
            </template>
        </UModal>

        <div v-if="workspaceStore.totalCount > workspaceStore.limit" class="flex justify-end gap-2 mt-4">
            <UButton icon="i-lucide-arrow-left" size="xs" variant="subtle" :disabled="workspaceStore.offset === 0"
                @click="workspaceStore.prevPage" />
            <UButton icon="i-lucide-arrow-right" size="xs" variant="subtle"
                :disabled="workspaceStore.data.length < workspaceStore.limit" @click="workspaceStore.nextPage" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '~/stores/useWorkspaceStore'
import type { CreateWorkspaceRequest, WorkspaceDto } from '~/types/request.types'
import { DateUtils } from '~/utils/date.utils'

definePageMeta({ layout: 'workspace' })
useHead({ title: 'Рабочие пространства' })
const workspaceStore = useWorkspaceStore()
const openCreateModal = ref(false)
const openDeleteModal = ref(false)
const openEditModal = ref(false)
const openRestoreModal = ref(false)
const selectedWorkspace = ref<WorkspaceDto | null>(null)
const formState = ref<CreateWorkspaceRequest>({ name: '' })
const formLoading = ref(false)

onMounted(fetchWorkspaces)

function onDelete(workspace: WorkspaceDto) {
    selectedWorkspace.value = workspace
    openDeleteModal.value = true
}

function onEdit(workspace: WorkspaceDto) {
    selectedWorkspace.value = workspace
    formState.value.name = selectedWorkspace.value.name
    openEditModal.value = true
}

function onRestore(project: WorkspaceDto) {
    selectedWorkspace.value = project
    openRestoreModal.value = true
}

async function confirmDelete() {
    if (!selectedWorkspace.value) return
    formLoading.value = true
    await workspaceStore.deleteWorkspace(selectedWorkspace.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await workspaceStore.list()
}

async function confirmRestore() {
    if (!selectedWorkspace.value) return
    formLoading.value = true
    await workspaceStore.restore(selectedWorkspace.value.id)
    formLoading.value = false
    openRestoreModal.value = false
    await fetchWorkspaces()
}

async function onSubmitCreate() {
    formLoading.value = true
    await workspaceStore.create({
        ...formState.value,
    })
    openCreateModal.value = false
    formLoading.value = false
    await workspaceStore.list()
}

async function onSubmitEdit() {
    formLoading.value = true
    await workspaceStore.update(selectedWorkspace.value!.id, {
        ...formState.value,
        id: selectedWorkspace.value!.id,
    })
    openEditModal.value = false
    formLoading.value = false
    await workspaceStore.list()
}
async function fetchWorkspaces() {
    await workspaceStore.list()
}

watch([openCreateModal], ([create]) => {
    if (!create) {
        formState.value = { name: '' }
        selectedWorkspace.value = null
    }
})
</script>
