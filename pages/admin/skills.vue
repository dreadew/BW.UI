<template>
    <div>
        <BaseGrid :store="skillStore" :columns="columns" show-include-deleted editable @create="openCreateModal = true"
            @edit="(item) => onEdit(item as SkillDto)" @delete="(item) => onDelete(item as SkillDto)">
            <template #title>
                <UiHeading level="4">Навыки</UiHeading>
            </template>
        </BaseGrid>
        <UModal v-model:open="openCreateModal" title="Создать навык">
            <template #body>
                <UForm :state="formState" @submit="onSubmitCreate">
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
            <template #body>
                <UForm :state="formState" @submit="onSubmitEdit">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название навыка" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="button" color="neutral" variant="ghost" @click="openCreateModal = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" :loading="formLoading">Сохранить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удаление навыка">
            <template #body>
                <UiText color="darker-neutral">Вы уверены, что хотите удалить навык <b>"{{ selectedSkill?.name }}"</b>?
                </UiText>
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
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useSkillStore } from '~/stores/useSkillStore'
import type { CreateSkillRequest, SkillDto } from '~/types/request.types'
import type { TableRow } from '@nuxt/ui'

useHead({ title: 'Навыки' })
const skillStore = useSkillStore()
const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const selectedSkill = ref<SkillDto | null>(null)
const formState = ref<CreateSkillRequest>({ name: '' })
const formLoading = ref(false)
const columns = [
    { accessorKey: 'id', header: 'ID', cell: ({ row }: { row: TableRow<SkillDto> }) => row.original.id },
    { accessorKey: 'name', header: 'Название', cell: ({ row }: { row: TableRow<SkillDto> }) => row.original.name },
    { accessorKey: 'createdAt', header: 'Дата создания', cell: ({ row }: { row: TableRow<SkillDto> }) => row.original.createdAt ? new Date(DateUtils.deserialize(row.original.createdAt)!).toLocaleString() : '', },
    { accessorKey: 'updatedAt', header: 'Дата обновления', cell: ({ row }: { row: TableRow<SkillDto> }) => row.original.updatedAt ? new Date(DateUtils.deserialize(row.original.updatedAt)!).toLocaleString() : '', },
    { id: 'action', header: 'Действия', cell: undefined }
]
function onEdit(skill: SkillDto) {
    selectedSkill.value = skill
    formState.value = { name: skill.name }
    openEditModal.value = true
}
function onDelete(skill: SkillDto) {
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
    await skillStore.update({
        ...formState.value,
        id: selectedSkill.value?.id!
    })
    openEditModal.value = false
    formLoading.value = false
    await skillStore.list()
}
</script>
