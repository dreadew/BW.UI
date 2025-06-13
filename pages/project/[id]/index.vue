<template>
  <div>
    <div>
      <div v-if="loading" class="p-4">
        <div class="flex items-center gap-4">
          <USkeleton class="h-16 w-16 rounded-full" />
          <div class="grid gap-2">
            <USkeleton class="h-6 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
          </div>
        </div>
      </div>
      <div v-else class="w-full flex items-center gap-4 border-b border-b-muted p-4">
        <div class="relative">
          <UAvatar :src="project?.path" :alt="project?.name" class="w-16 h-16" />
          <UButton icon="i-heroicons-camera" color="primary" size="xs" class="absolute bottom-0 left-0"
            @click="openAvatarModal = true" title="Загрузить аватарку" />
          <UButton v-if="project?.path" icon="i-heroicons-trash" color="error" size="xs"
            class="absolute bottom-0 right-0" @click="openDeleteAvatarModal = true" title="Удалить аватарку" />
        </div>
        <div class="flex flex-col">
          <UiHeading size="lg">{{ project?.name }}</UiHeading>
          <UiText size="sm" color="darker-neutral">Дата создания: {{
            DateUtils.deserialize(project?.createdAt)?.toLocaleDateString() }}</UiText>
          <UiText size="xs" color="neutral">ID: {{ project?.id }}</UiText>
        </div>
        <div class="ml-auto flex gap-2">
          <UButton icon="i-lucide-pencil" variant="subtle" color="primary" size="sm" :title="'Редактировать проект'"
            @click="openEditModal = true" />
          <UButton icon="i-lucide-trash" variant="subtle" color="error" size="sm" :title="'Удалить проект'"
            @click="openDeleteModal = true" />
        </div>
      </div>
      <UTabs v-model="tab" :items="tabs" variant="link">
        <template #sections>
          <ProjectSections :project-id="project?.id" :is-active="tab === 'sections'" />
        </template>
        <template #tasks>
          <ProjectTasks :project-id="project?.id" :is-active="tab === 'tasks'" />
        </template>
        <template #my-tasks>
          <ProjectMyTasks :project-id="project?.id" :is-active="tab === 'my-tasks'" />
        </template>
        <template #users>
          <ProjectUsers :project-id="project?.id" :is-active="tab === 'users'" />
        </template>
        <template #threads>
          <ProjectThreads :project-id="project?.id" :is-active="tab === 'threads'" />
        </template>
        <template #roles>
          <ProjectRoles :project-id="project?.id" :is-active="tab === 'roles'" />
        </template>
      </UTabs>
      <UModal v-model:open="openEditModal" title="Редактировать проект">
        <template #body>
          <UForm :state="formState" @submit="onSubmitEdit">
            <UFormField label="Название" name="name" required>
              <UInput class="w-full" v-model="formState.name" required placeholder="Название проекта" />
            </UFormField>
            <UButton type="submit" color="primary" class="mt-4" :loading="formLoading">Сохранить</UButton>
          </UForm>
        </template>
      </UModal>
      <UModal v-model:open="openDeleteModal" title="Удаление проекта">
        <template #body>
          <UiText color="darker-neutral">
            Вы уверены, что хотите удалить проект <b>{{ project?.name }}</b>?
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
              <UInput type="file" accept="image/*" @change="onFileChange" />
            </UFormField>
            <UButton type="submit" color="primary" class="mt-4" :loading="isAvatarLoading">Загрузить</UButton>
          </UForm>
        </template>
      </UModal>
      <UModal v-model:open="openDeleteAvatarModal" title="Удалить аватарку?">
        <template #body>
          <UiText color="darker-neutral">
            Вы уверены, что хотите удалить <b>аватарку</b> проекта?
          </UiText>
        </template>
        <template #footer>
          <div class="w-full flex gap-2 justify-end">
            <UButton type="button" color="neutral" variant="ghost" @click="openDeleteModal = false">Отмена</UButton>
            <UButton type="button" color="error" variant="solid" @click="onDeleteAvatar" :loading="isAvatarLoading">
              Удалить</UButton>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'project' })
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '~/stores/useProjectStore'

useHead({ title: 'Проект' })
const route = useRoute()
const router = useRouter()
const projectId = computed(() => route.params.id as string)
const projectStore = useProjectStore()
const { currentProject: project, loading } = storeToRefs(projectStore)
const openEditModal = ref(false)
const openDeleteModal = ref(false)
const formState = ref<{
  name: string;
}>({ name: '' })
const formLoading = ref(false)
const tab = ref('sections')
const tabs = [
  { label: 'Секции', value: 'sections', slot: 'sections' as const },
  { label: 'Задачи', value: 'tasks', slot: 'tasks' as const },
  { label: 'Мои задачи', value: 'my-tasks', slot: 'my-tasks' as const },
  { label: 'Пользователи', value: 'users', slot: 'users' as const },
  { label: 'Треды', value: 'threads', slot: 'threads' as const },
  { label: 'Роли', value: 'roles', slot: 'roles' as const }
]
const openAvatarModal = ref(false)
const avatarFormState = ref({})
const avatarFile = ref<File | null>(null)
const isAvatarLoading = ref(false)
const openDeleteAvatarModal = ref(false)

watch(openEditModal, (open) => {
  if (open && project.value) {
    formState.value = { name: project.value.name }
  }
})

async function fetchProject() {
  loading.value = true
  await projectStore.get(projectId.value)
  loading.value = false
}

onMounted(fetchProject)

async function onSubmitEdit() {
  if (!project.value) return
  formLoading.value = true
  await projectStore.update({
    id: project.value.id,
    name: formState.value.name
  })
  formLoading.value = false
  openEditModal.value = false
  await projectStore.get(projectId.value)
}
async function confirmDelete() {
  if (!project.value) return
  formLoading.value = true
  await projectStore.deleteProject({ id: project.value.id })
  formLoading.value = false
  openDeleteModal.value = false
  router.push('/project')
}
const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  avatarFile.value = files && files[0] ? files[0] : null
}

const onUploadAvatar = async () => {
  if (!project.value?.id || !avatarFile.value) return
  isAvatarLoading.value = true
  try {
    await projectStore.uploadPicture(project.value.id, avatarFile.value)
    openAvatarModal.value = false
    avatarFile.value = null
    await projectStore.get(project.value.id)
  } finally {
    isAvatarLoading.value = false
  }
}
const onDeleteAvatar = async () => {
  if (!project.value?.id) return
  isAvatarLoading.value = true
  try {
    await projectStore.deletePicture(project.value.id, { id: project.value.id })
    openDeleteAvatarModal.value = false
    await projectStore.get(project.value.id)
  } finally {
    isAvatarLoading.value = false
  }
}
</script>