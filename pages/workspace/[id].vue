<template>
    <div>
        <div v-if="!workspace">
            <UCard class="flex flex-col items-center justify-center p-8 mt-12">
                <UIcon name="i-lucide-alert-triangle" class="text-4xl text-primary mb-2" />
                <UiHeading size="lg">Рабочее пространство не найдено</UiHeading>
                <UiText color="neutral" class="mt-2">Проверьте ссылку или выберите рабочее пространство из списка.
                </UiText>
            </UCard>
        </div>
        <div v-else>
            <UiHeading size="2xl" class="mb-6">Рабочее пространство: {{ workspace?.name }}</UiHeading>
            <div class="flex items-center gap-4 mb-4">
                <UButton color="primary" @click="openEditModal = true">Редактировать</UButton>
                <UButton color="error" @click="openDeleteModal = true">Удалить</UButton>
            </div>
            <div class="mt-8">
                <UiHeading size="lg" class="mb-2">Папки и файлы</UiHeading>
                <NuxtLink :to="`/workspace/${workspaceId}/admin/directories`">
                    <UButton color="primary" variant="soft">Управление папками</UButton>
                </NuxtLink>
            </div>
            <UModal v-model:open="openEditModal" title="Редактировать рабочее пространство">
                <template #body>
                    <UForm :state="formState" :schema="editFormSchema" @submit="onSubmitEdit">
                        <UFormField label="Название" name="name" required>
                            <UInput v-model="formState.name" required placeholder="Название рабочего пространства" />
                        </UFormField>
                        <UButton type="submit" color="primary" class="mt-4" :loading="formLoading">Сохранить</UButton>
                    </UForm>
                </template>
            </UModal>
            <UModal v-model:open="openDeleteModal" title="Удаление рабочего пространства">
                <template #body>
                    <UiText color="error">Вы уверены, что хотите удалить рабочее пространство "{{ workspace?.name }}"?
                    </UiText>
                </template>
                <template #footer>
                    <UButton color="neutral" @click="openDeleteModal = false">Отмена</UButton>
                    <UButton color="error" @click="confirmDelete" :loading="formLoading">Удалить</UButton>
                </template>
            </UModal>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'workspace' })
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useWorkspaceStore } from '~/stores/useWorkspaceStore'
import { updateWorkspaceRequestSchema } from '~/schemas/generated.schema'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'
useHead({ title: 'Рабочее пространство' })
const route = useRoute()
const router = useRouter()
const workspaceId = computed(() => route.params.id as string)
const workspaceStore = useWorkspaceStore()
const { workspaces } = storeToRefs(workspaceStore)
const workspace = computed(() => workspaces.value.find(w => w.id === workspaceId.value))
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const formState = ref<any>({ name: '' })
const formLoading = ref(false)
const editFormSchema = updateWorkspaceRequestSchema;

watch(openEditModal, (open) => {
    if (open && workspace.value) {
        formState.value = { name: workspace.value.name }
    }
})

async function onSubmitEdit() {
    formLoading.value = true
    await workspaceStore.update(workspaceId.value, formState.value)
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
workspaceStore.list()
</script>
