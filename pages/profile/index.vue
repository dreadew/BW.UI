<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UIcon name="i-lucide-user-circle" class="text-primary text-3xl" />
      <UiHeading size="2xl">Профиль пользователя</UiHeading>
    </div>
    <USkeleton v-if="!user" class="w-full h-120 mt-2" />
    <UCard v-if="user">
      <div class="flex items-center gap-6 mb-6">
        <div class="relative">
          <template v-if="user.path">
            <img :src="user.path" class="w-24 h-24 rounded-full object-cover" alt="Аватар" />
            <UButton icon="i-heroicons-trash" color="error" size="xs" class="absolute bottom-0 right-0"
              @click="onDeleteAvatar" title="Удалить аватарку" />
          </template>
          <template v-else>
            <div
              class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 select-none">
              {{ user.username?.charAt(0).toUpperCase() || '?' }}
            </div>
          </template>
          <UButton icon="i-heroicons-camera" color="primary" size="xs" class="absolute bottom-0 left-0"
            @click="openAvatarModal = true" title="Загрузить аватарку" />
        </div>
        <div>
          <UiHeading size="lg">{{ user.username }}</UiHeading>
          <UiText color="neutral">{{ user.email }}</UiText>
          <UiText color="neutral">ID: {{ user.id }}</UiText>
          <div class="flex gap-2 mt-2">
            <UBadge v-if="user.isVerified" color="success">Верифицирован</UBadge>
            <UBadge v-else color="warning">Не верифицирован</UBadge>
            <UBadge v-if="user.isSuspended" color="error">Заблокирован</UBadge>
          </div>
        </div>
        <div class="ml-auto flex gap-2">
          <UButton color="primary" @click="openEdit = true">Редактировать</UButton>
        </div>
      </div>
      <UTabs v-model="tab" :items="tabs" variant="link">
        <template #sessions>
          <ProfileSessions />
        </template>
        <template #schedule>
          <ProfileSchedule />
        </template>
        <template #skills>
          <ProfileSkills :user="user" />
        </template>
      </UTabs>
    </UCard>
    <UModal v-model:open="openEdit" title="Редактировать профиль">
      <template #body>
        <UForm class="space-y-4" :state="editState" @submit="onEditProfile">
          <UFormField label="Имя пользователя" name="username">
            <UInput class="w-full" v-model="editState.username" />
          </UFormField>
          <UFormField label="Email" name="email">
            <UInput class="w-full" v-model="editState.email" />
          </UFormField>
          <UFormField label="Телефон" name="phoneNumber">
            <UInput placeholder="+7 (999) 999-99-99" class="w-full" v-model="editState.phoneNumber" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4 float-end">Сохранить</UButton>
        </UForm>
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '~/stores/useUserStore'
import { useSessionStore } from '~/stores/useSessionStore'
import { useUserScheduleStore } from '~/stores/useUserScheduleStore'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { user, userId } = storeToRefs(userStore)
const sessionStore = useSessionStore()
const userScheduleStore = useUserScheduleStore()

const openEdit = ref(false)
const editState = ref({ username: '', email: '', phoneNumber: '' })
const tab = ref('sessions')
const tabs = [
  { label: 'Сессии', value: 'sessions', slot: 'sessions' as const },
  { label: 'Расписание', value: 'schedule', slot: 'schedule' as const },
  { label: 'Навыки', value: 'skills', slot: 'skills' as const }
]

const openAvatarModal = ref(false)
const isAvatarLoading = ref(false)
const avatarFile = ref<File | null>(null)
const avatarFormState = ref({})

watch(openEdit, (val) => {
  if (val && user.value) {
    editState.value = {
      username: user.value.username,
      email: user.value.email,
      phoneNumber: user.value.phoneNumber || ''
    }
  }
})

watch(
  () => userId.value,
  async (id) => {
    if (id) {
      await userStore.fetchCurrentUser()
      await sessionStore.list()
      await userScheduleStore.findByUser()
    }
  },
)

const onEditProfile = async () => {
  if (!userId.value) return
  await userStore.updateProfile(userId.value, {
    id: userId.value,
    email: editState.value.email,
    phoneNumber: editState.value.phoneNumber,
    password: ''
  })
  openEdit.value = false
}

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  avatarFile.value = files && files[0] ? files[0] : null
}

const onUploadAvatar = async () => {
  if (!userId.value || !avatarFile.value) return
  isAvatarLoading.value = true
  try {
    await userStore.uploadProfilePhoto(userId.value, avatarFile.value)
    openAvatarModal.value = false
    avatarFile.value = null
  } finally {
    isAvatarLoading.value = false
  }
}

const onDeleteAvatar = async () => {
  if (!userId.value) return
  await userStore.deleteProfilePhoto(userId.value)
}

const onLogout = async () => {
  await userStore.logout()
  window.location.href = '/auth/sign-in'
}
</script>
