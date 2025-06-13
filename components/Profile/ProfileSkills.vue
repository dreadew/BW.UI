<template>
    <div>
        <UiHeading size="md" class="mb-2">Навыки</UiHeading>
        <BaseDataGrid without-editing without-search :data="skillsWithId" :columns="columns" without-heading
            @create="openAddModal = true" @delete="onDeleteSkill" />
        <UModal v-model:open="openAddModal" title="Добавить навык">
            <template #body>
                <UForm :state="{ skillId: selectedSkillId }" @submit="onAddSkill">
                    <UFormField label="Навык" name="skillId" required>
                        <USelect v-model="selectedSkillId" :items="availableSkillOptions" placeholder="Выберите навык"
                            class="w-full" required />
                    </UFormField>
                    <div class="flex justify-end mt-4">
                        <UButton type="button" color="neutral" variant="ghost" @click="openAddModal = false">Отмена
                        </UButton>
                        <UButton type="submit" color="primary" :disabled="!selectedSkillId || skillStore.loading"
                            :loading="skillStore.loading">Добавить</UButton>
                    </div>
                </UForm>
            </template>
        </UModal>
        <UModal v-model:open="openDeleteModal" title="Удалить навык?">
            <template #body>
                <UiText color="darker-neutral">
                    Вы уверены, что хотите удалить навык <b>"{{ skillToDelete?.name }}"</b>?
                </UiText>
            </template>
            <template #footer>
                <div class="w-full flex justify-end gap-2">
                    <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена
                    </UButton>
                    <UButton type="button" color="error" variant="solid" @click="confirmDeleteSkill"
                        :loading="skillStore.loading" :disabled="skillStore.loading">Удалить</UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '~/stores/useUserStore'
import { useSkillStore } from '~/stores/useSkillStore'
import type { SkillDto, UserDto } from '~/types/request.types';

const props = defineProps<{ user: UserDto }>()
const userStore = useUserStore()
const skillStore = useSkillStore()

const openAddModal = ref(false)
const openDeleteModal = ref(false)
const selectedSkillId = ref('')
const skillToDelete = ref<SkillDto | null>(null)

const skillsWithId = computed(() => (props.user.skills || []).map((s: SkillDto) => ({ ...s, id: s.id })))

const columns = [
    { accessorKey: 'name', header: 'Навык' },
    { id: 'action' }
]

const availableSkillOptions = computed(() => {
    const userSkillIds = new Set((props.user.skills || []).map((s: SkillDto) => s.id))
    return (skillStore.data || [])
        .filter((s: SkillDto) => !userSkillIds.has(s.id))
        .map((s: SkillDto) => ({ label: s.name, value: s.id }))
})

onMounted(async () => {
    await skillStore.list()
})

async function onAddSkill(e: Event) {
    e.preventDefault()
    if (!selectedSkillId.value) return
    await userStore.addSkill({ id: props.user.id, skillId: selectedSkillId.value })
    selectedSkillId.value = ''
    openAddModal.value = false
    await userStore.fetchCurrentUser()
}

function onDeleteSkill(skill: SkillDto) {
    skillToDelete.value = skill
    openDeleteModal.value = true
}

async function confirmDeleteSkill() {
    if (!skillToDelete.value) return
    await userStore.removeSkill({ id: props.user.id, skillId: skillToDelete.value.id })
    openDeleteModal.value = false
    skillToDelete.value = null
    await userStore.fetchCurrentUser()
}
</script>
