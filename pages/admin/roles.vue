<template>
    <div>
        <UiHeading size="2xl" class="mb-6">Роли</UiHeading>
        <div class="flex items-center gap-4 mb-4">
            <UInput v-model="search" placeholder="Поиск по названию..." class="w-64" />
            <UButton color="primary" @click="openCreateModal = true">Создать роль</UButton>
        </div>
        <UTable :data="filteredAndSortedRoles" :columns="columns" class="w-full" @sort="onSort">
            <template #cell(actions)="{ row }">
                <UButton size="sm" variant="soft" color="primary" @click="onEdit(row.original)">Редактировать</UButton>
                <UButton size="sm" variant="soft" color="danger" class="ml-2" @click="onDelete(row.original)">Удалить
                </UButton>
            </template>
        </UTable>
        <div class="flex items-center justify-between mt-4">
            <div>
                <span>Показано {{ (page - 1) * pageSize + 1 }}-{{ Math.min(page * pageSize, total) }} из {{ total
                    }}</span>
            </div>
            <div class="flex items-center gap-2">
                <label>На странице:</label>
                <select v-model.number="pageSize" @change="onPageSizeChange($event.target.value)"
                    class="border rounded px-2 py-1">
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                    <option :value="50">50</option>
                </select>
                <UPagination :page="page" :page-count="Math.ceil(total / pageSize)" @update:page="onPageChange" />
            </div>
        </div>

        <!-- Create Modal -->
        <UModal v-model:open="openCreateModal" title="Создать роль">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Создать роль</span>
                    <UButton icon="i-lucide-x" color="gray" variant="ghost" @click="openCreateModal = false"
                        size="sm" />
                </div>
            </template>
            <template #body>
                <UForm :state="formState" :schema="createFormSchema" @submit="onSubmitCreate">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название роли" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Создать</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>

        <!-- Edit Modal -->
        <UModal v-model:open="openEditModal" title="Редактировать роль">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Редактировать роль</span>
                    <UButton icon="i-lucide-x" color="gray" variant="ghost" @click="openEditModal = false" size="sm" />
                </div>
            </template>
            <template #body>
                <UForm :state="formState" :schema="editFormSchema" @submit="onSubmitEdit">
                    <UFormField label="Название" name="name" required>
                        <UInput v-model="formState.name" required placeholder="Название роли" class="w-full" />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="submit" color="primary" :loading="formLoading">Сохранить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>

        <!-- Delete Confirmation Modal -->
        <UModal v-model:open="openDeleteModal" title="Удаление роли">
            <template #header>
                <div class="flex justify-between items-center w-full">
                    <span>Удаление роли</span>
                    <UButton icon="i-lucide-x" color="gray" variant="ghost" @click="openDeleteModal = false"
                        size="sm" />
                </div>
            </template>
            <template #body>
                <UiText color="danger">Вы уверены, что хотите удалить роль "{{ selectedRole?.name }}"?</UiText>
            </template>
            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton color="gray" @click="openDeleteModal = false">Отмена</UButton>
                    <UButton color="danger" @click="confirmDelete" :loading="formLoading">Удалить</UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoleStore } from '~/stores/useRoleStore'
import { createUserRoleRequestSchema, updateUserRoleRequestSchema } from '~/schemas/generated.schema'
import { toTypedSchema } from '@vee-validate/zod'
import { DateUtils } from '~/utils/date.utils'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'

const roleStore = useRoleStore()
const { roles, isLoading } = storeToRefs(roleStore)

const search = ref('')
const sortKey = ref('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')
const page = ref(1)
const pageSize = ref(10)
const total = computed(() => roleStore.total ?? 0)

const openCreateModal = ref(false)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const selectedRole = ref<any>(null)
const formState = ref<any>({ name: '' })
const formLoading = ref(false)

const createFormSchema = toTypedSchema(createUserRoleRequestSchema)
const editFormSchema = toTypedSchema(updateUserRoleRequestSchema)

const columns = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => row.original.id,
        enableSorting: true
    },
    {
        accessorKey: 'name',
        header: 'Название',
        cell: ({ row }) => row.original.name,
        enableSorting: true
    },
    {
        accessorKey: 'createdAt',
        header: 'Дата создания',
        cell: ({ row }) => row.original.createdAt ? new Date(DateUtils.deserialize(row.original.createdAt)!).toLocaleString() : '',
        enableSorting: true
    },
    {
        accessorKey: 'updatedAt',
        header: 'Дата обновления',
        cell: ({ row }) => row.original.updatedAt ? new Date(DateUtils.deserialize(row.original.updatedAt)!).toLocaleString() : '',
        enableSorting: true
    },
    {
        id: 'actions',
        header: 'Действия',
        cell: undefined // handled by #cell(actions)
    }
]

// Фильтрация, сортировка и пагинация через стор
async function fetchRoles() {
    await roleStore.list({
        page: page.value,
        pageSize: pageSize.value,
        search: search.value,
        sortKey: sortKey.value,
        sortOrder: sortOrder.value
    })
}

watch([search, sortKey, sortOrder, page, pageSize], fetchRoles, { immediate: true })

const filteredAndSortedRoles = computed(() => roles.value)

function onSort(col) {
    if (sortKey.value === col.accessorKey) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = col.accessorKey
        sortOrder.value = 'asc'
    }
    page.value = 1
}

function onPageChange(newPage) {
    page.value = newPage
}

function onPageSizeChange(newSize) {
    pageSize.value = newSize
    page.value = 1
}

function onEdit(role) {
    selectedRole.value = role
    formState.value = { id: role.id, name: role.name }
    openEditModal.value = true
}

function onDelete(role) {
    selectedRole.value = role
    openDeleteModal.value = true
}

async function confirmDelete() {
    if (!selectedRole.value) return
    formLoading.value = true
    await roleStore.deleteRole(selectedRole.value.id)
    formLoading.value = false
    openDeleteModal.value = false
    await roleStore.list()
}

async function onSubmitCreate() {
    formLoading.value = true
    await roleStore.create(formState.value)
    openCreateModal.value = false
    formLoading.value = false
    await roleStore.list()
}

async function onSubmitEdit() {
    formLoading.value = true
    await roleStore.update(formState.value)
    openEditModal.value = false
    formLoading.value = false
    await roleStore.list()
}

watch([openCreateModal, openEditModal], ([create, edit]) => {
    if (!create && !edit) {
        formState.value = { name: '' }
        selectedRole.value = null
    }
})

roleStore.list()
</script>
