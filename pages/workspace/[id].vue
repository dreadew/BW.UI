<template>
    <div>
        <div v-if="!isLoading && !workspace">
            <UCard class="flex flex-col items-center justify-center p-8 mt-12">
                <UIcon name="i-lucide-alert-triangle" class="text-4xl text-primary mb-2" />
                <UiHeading size="lg">Рабочее пространство не найдено</UiHeading>
                <UiText color="neutral" class="mt-2">Проверьте ссылку или выберите рабочее пространство из списка.
                </UiText>
            </UCard>
        </div>
        <div v-else>
            <div v-if="isLoading" class="p-2">
                <div class="flex items-center gap-4">
                    <USkeleton class="h-16 w-16 rounded-full" />
                    <div class="grid gap-2">
                        <USkeleton class="h-6 w-[250px]" />
                        <USkeleton class="h-4 w-[200px]" />
                    </div>
                </div>
            </div>

            <div v-else class="w-full flex items-center gap-4 border-b border-b-neutral-200 p-4">
                <div class="relative">
                    <UAvatar :src="workspace?.path" :alt="workspace?.name" class="w-16 h-16" />
                    <UButton icon="i-heroicons-camera" color="primary" size="xs" class="absolute bottom-0 left-0"
                        @click="openAvatarModal = true" title="Загрузить аватарку" />
                    <UButton v-if="workspace?.path" icon="i-heroicons-trash" color="error" size="xs"
                        class="absolute bottom-0 right-0" @click="openDeleteAvatarModal = true"
                        title="Удалить аватарку" />
                </div>
                <div class="flex flex-col">
                    <UiHeading size="lg">{{ workspace?.name }}</UiHeading>
                    <UiText size="sm" color="darker-neutral">Дата создания: {{
                        DateUtils.deserialize(workspace?.createdAt)?.toLocaleDateString() }}</UiText>
                </div>
                <div class="ml-auto flex gap-2">
                    <UButton icon="i-lucide-pencil" variant="subtle" color="primary" size="sm"
                        :title="'Редактировать рабочее пространство'" @click="openEditModal = true" />
                    <UButton icon="i-lucide-trash" variant="subtle" color="error" size="sm"
                        :title="'Удалить рабочее пространство'" @click="openDeleteModal = true" />
                </div>
            </div>

            <UTabs v-model="tab" :items="tabs" variant="link">
                <template #positions>
                    <WorkspacePositions :is-active="tab === 'positions'" />
                </template>
                <template #users>
                    <WorkspaceUsers />
                </template>
                <template #roles>
                    <WorkspaceRoles />
                </template>
                <template #directories>
                    <WorkspaceDirectories />
                </template>
                <template #projects>
                    <WorkspaceProjects />
                </template>
            </UTabs>

            <UModal v-model:open="openEditModal" title="Редактировать рабочее пространство">
                <template #body>
                    <UForm :state="formState" @submit="onSubmitEdit">
                        <UFormField label="Название" name="name" required>
                            <UInput class="w-full" v-model="formState.name" required
                                placeholder="Название рабочего пространства" />
                        </UFormField>
                        <UButton type="submit" color="primary" class="mt-4 float-right" :loading="formLoading">Сохранить
                        </UButton>
                    </UForm>
                </template>
            </UModal>
            <UModal v-model:open="openDeleteModal" title="Удаление рабочего пространства">
                <template #body>
                    <UiText color="darker-neutral">
                        Вы уверены, что хотите удалить рабочее пространство <b>{{ workspace?.name }}</b>?
                    </UiText>
                </template>
                <template #footer>
                    <div class="w-full flex gap-2 justify-end">
                        <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена
                        </UButton>
                        <UButton type="button" color="error" variant="solid" @click="confirmDelete">Удалить</UButton>
                    </div>
                </template>
            </UModal>
            <UModal v-model:open="openAvatarModal" title="Загрузить аватарку">
                <template #body>
                    <UForm :state="avatarFormState" @submit="onUploadAvatar">
                        <UFormField label="Выберите изображение" name="avatar">
                            <UInput class="w-full" type="file" accept="image/*" @change="onFileChange" />
                        </UFormField>
                        <UButton type="submit" color="primary" class="mt-4 float-right" :loading="isAvatarLoading">
                            Загрузить</UButton>
                    </UForm>
                </template>
            </UModal>
            <UModal v-model:open="openDeleteAvatarModal" title="Удалить аватарку?">
                <template #body>
                    <UiText color="darker-neutral">
                        Вы уверены, что хотите удалить <b>аватарку</b> рабочего пространства?
                    </UiText>
                </template>
                <template #footer>
                    <div class="w-full flex gap-2 justify-end">
                        <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена
                        </UButton>
                        <UButton type="button" color="error" variant="solid" @click="onDeleteAvatar"
                            :loading="isAvatarLoading">Удалить</UButton>
                    </div>
                </template>
            </UModal>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'workspace' })
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '~/stores/useWorkspaceStore'

useHead({ title: 'Рабочее пространство' })
const route = useRoute()
const router = useRouter()
const workspaceId = computed(() => route.params.id as string)
const workspaceStore = useWorkspaceStore()
const { data } = storeToRefs(workspaceStore)
const isLoading = ref(true)
const workspace = computed(() => data.value?.find(w => w.id === workspaceId.value))
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const formState = ref<{
    name: string
}>({ name: '' })
const formLoading = ref(false)

const openAvatarModal = ref(false)
const avatarFormState = ref({})
const avatarFile = ref<File | null>(null)
const isAvatarLoading = ref(false)

const openDeleteAvatarModal = ref(false)

const tab = ref('positions')
const tabs = [
    { label: 'Должности', value: 'positions', slot: 'positions' as const },
    { label: 'Пользователи', value: 'users', slot: 'users' as const },
    { label: 'Роли', value: 'roles', slot: 'roles' as const },
    { label: 'Директории', value: 'directories', slot: 'directories' as const },
    { label: 'Проекты', value: 'projects', slot: 'projects' as const }
]

watch(openEditModal, (open) => {
    if (open && workspace.value) {
        formState.value = { name: workspace.value.name }
    }
})

async function fetchWorkspace() {
    isLoading.value = true
    await workspaceStore.list()
    isLoading.value = false
}

onMounted(fetchWorkspace)

async function onSubmitEdit() {
    formLoading.value = true
    await workspaceStore.update(workspaceId.value, {
        id: workspaceId.value,
        name: formState.value.name
    })
    formLoading.value = false
    openEditModal.value = false
    await workspaceStore.list()
}
async function confirmDelete() {
    formLoading.value = true
    await workspaceStore.deleteWorkspace(workspaceId.value)
    formLoading.value = false
    openDeleteModal.value = false
    router.push('/workspace')
}

const onFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    avatarFile.value = files && files[0] ? files[0] : null
}

const onUploadAvatar = async () => {
    if (!workspaceId.value || !avatarFile.value) return
    isAvatarLoading.value = true
    try {
        await workspaceStore.uploadPicture(workspaceId.value, avatarFile.value)
        openAvatarModal.value = false
        avatarFile.value = null
        await workspaceStore.list()
    } finally {
        isAvatarLoading.value = false
    }
}
const onDeleteAvatar = async () => {
    if (!workspaceId.value) return
    isAvatarLoading.value = true
    try {
        await workspaceStore.deletePicture(workspaceId.value, { id: workspaceId.value })
        openDeleteAvatarModal.value = false
        await workspaceStore.list()
    } finally {
        isAvatarLoading.value = false
    }
}
</script>
