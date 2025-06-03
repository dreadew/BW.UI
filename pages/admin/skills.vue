<template>
    <div>
        <UiHeading size="2xl" class="mb-6">Навыки</UiHeading>
        <div class="flex items-center gap-4 mb-4">
            <UInput v-model="search" placeholder="Поиск по названию..." class="w-64" />
            <UButton color="primary" @click="openCreateModal = true">Создать навык</UButton>
        </div>
        <UTable :data="filteredAndSortedSkills" :columns="columns" class="w-full">
            <template #cell(actions)="{ row }">
                <UButton size="sm" variant="soft" color="primary" @click="onEdit(row.original)">Редактировать</UButton>
                <UButton size="sm" variant="soft" color="error" class="ml-2" @click="onDelete(row.original)">Удалить
                </UButton>
            </template>
        </UTable>
        <div class="flex gap-2 mt-4">
            <UButton size="xs" :disabled="offset === 0" @click="prevPage">Назад</UButton>
            <UButton size="xs" :disabled="skills.length < limit" @click="nextPage">Вперёд</UButton>
        </div>
        <UModal v-model:open="openCreateModal" title="Создать навык">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Создать навык</span>
                    <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="openCreateModal = false"
                        size="sm" />
                </div>
            </template>
            <template #body>
                <UForm :state="formState" :schema="createFormSchema" @submit="onSubmitCreate">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название навыка" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Создать</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openEditModal" title="Редактировать навык">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Редактировать навык</span>
                    <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="openEditModal = false" size="sm" />
                </div>
            </template>
            <template #body>
                <UForm :state="formState" :schema="editFormSchema" @submit="onSubmitEdit">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название навыка" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Сохранить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление навыка">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Удаление навыка</span>
                    <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="openDeleteModal = false"
                        size="sm" />
                </div>
            </template>
            <template #body>
                <UiText color="error">Вы уверены, что хотите удалить навык "{{ selectedSkill?.name }}"?</UiText>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton color="neutral" @click="openDeleteModal = false">Отмена</UButton>
                    <UButton color="error" @click="confirmDelete" :loading="formLoading">Удалить</UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSkillStore } from '~/stores/useSkillStore'
import { createSkillRequestSchema, updateSkillRequestSchema } from '~/schemas/generated.schema'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'
import type { Skill } from '~/types/response.types'
useHead({ title: 'Навыки' })
const skillStore = useSkillStore()
const { skills, isLoading } = storeToRefs(skillStore)
const search = ref('')
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const selectedSkill = ref<any>(null)
const formState = ref<any>({ name: '' })
const formLoading = ref(false)
const limit = ref(20)
const offset = ref(0)
const createFormSchema = createSkillRequestSchema;
const editFormSchema = updateSkillRequestSchema;
const columns = [
    { accessorKey: 'id', header: 'ID', cell: ({ row }) => row.original.id },
    { accessorKey: 'name', header: 'Название', cell: ({ row }) => row.original.name },
    { accessorKey: 'createdAt', header: 'Дата создания', cell: ({ row }) => row.original.createdAt },
    { accessorKey: 'updatedAt', header: 'Дата обновления', cell: ({ row }) => row.original.updatedAt },
    { id: 'actions', header: 'Действия', cell: undefined }
]
const filteredAndSortedSkills = computed(() => {
    let data = skills.value
    if (search.value) {
        data = data.filter(s => s.name.toLowerCase().includes(search.value.toLowerCase()))
    }
    return data
})
function onEdit(skill: Skill) {
    selectedSkill.value = skill
    formState.value = { id: skill.id, name: skill.name }
    openEditModal.value = true
}
function onDelete(skill: Skill) {
    selectedSkill.value = skill
    openDeleteModal.value = true
}
async function confirmDelete() {
    if (!selectedSkill.value) return
    formLoading.value = true
    await skillStore.deleteSkill(selectedSkill.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await skillStore.list()
}
async function onSubmitCreate() {
    formLoading.value = true
    await skillStore.create(formState.value)
    openCreateModal.value = false
    formLoading.value = false
    await skillStore.list()
}
async function onSubmitEdit() {
    formLoading.value = true
    await skillStore.update(formState.value)
    openEditModal.value = false
    formLoading.value = false
    await skillStore.list()
}
async function fetchSkills() {
    await skillStore.list({ limit: limit.value, offset: offset.value, search: search.value })
}
function nextPage() {
    offset.value += limit.value
    fetchSkills()
}
function prevPage() {
    offset.value = Math.max(0, offset.value - limit.value)
    fetchSkills()
}
watch([limit, offset, search], fetchSkills)
watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = { name: '' }
        selectedSkill.value = null
    }
})
skillStore.list()
</script>
