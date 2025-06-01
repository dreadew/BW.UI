<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <UIcon name="i-lucide-user-circle" class="text-primary text-3xl" />
      <UiHeading size="2xl">Профиль пользователя</UiHeading>
    </div>
    <UCard v-if="user">
      <div class="flex items-center gap-6 mb-6">
        <div class="relative">
          <template v-if="user.photoPathWithUrl">
            <img :src="user.photoPathWithUrl" class="w-24 h-24 rounded-full object-cover" alt="Аватар" />
            <UButton
              icon="i-heroicons-trash"
              color="error"
              size="xs"
              class="absolute bottom-0 right-0"
              @click="onDeleteAvatar"
              title="Удалить аватарку"
            />
          </template>
          <template v-else>
            <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 select-none">
              {{ user.username?.charAt(0).toUpperCase() || '?' }}
            </div>
          </template>
          <UButton
            icon="i-heroicons-camera"
            color="primary"
            size="xs"
            class="absolute bottom-0 left-0"
            @click="openAvatarModal = true"
            title="Загрузить аватарку"
          />
        </div>
        <div>
          <UiHeading size="lg">{{ user.username }}</UiHeading>
          <UiText color="neutral">{{ user.email }}</UiText>
          <UiText color="neutral">ID: {{ user.id }}</UiText>
        </div>
        <div class="ml-auto flex gap-2">
          <UButton color="primary" @click="openEdit = true">Редактировать</UButton>
        </div>
      </div>
      <UTabs v-model="tab" :items="tabs" variant="link">
        <template #profile="{ item }">
          <div>
            <UiHeading size="md" class="mb-2">Информация</UiHeading>
            <UiText>Имя пользователя: {{ user.username }}</UiText>
            <UiText>Email: {{ user.email }}</UiText>
            <UiText>Телефон: {{ user.phoneNumber }}</UiText>
          </div>
        </template>
        <template #sessions>
          <div>
            <UiHeading size="md" class="mb-2">Сессии</UiHeading>
            <div v-if="sessionsLoading">
              <UiText>Загрузка...</UiText>
            </div>
            <div v-else>
              <div v-if="sessions.length === 0">
                <UiText>Нет активных сессий.</UiText>
              </div>
              <UCard v-for="session in sessions" :key="session.id" class="mb-2">
                <UiText>IP: {{ session.location }}</UiText>
                <UiText>Создана: {{ session.createdAt }}</UiText>
                <UButton size="xs" color="error" class="mt-2" @click="revokeSession(session.id)">Завершить</UButton>
              </UCard>
              <div class="flex gap-2 mt-2">
                <UButton size="xs" :disabled="sessionsOffset === 0" @click="loadSessionsPrev">Назад</UButton>
                <UButton size="xs" :disabled="sessions.length < sessionsLimit" @click="loadSessionsNext">Вперёд</UButton>
              </div>
            </div>
          </div>
        </template>
        <template #schedule>
          <div>
            <UiHeading size="md" class="mb-2">Расписание</UiHeading>
            <div class="mb-4">
              <UButton color="primary" size="sm" @click="openScheduleCreate = true">Создать расписание</UButton>
            </div>
            <div v-if="scheduleLoading">
              <UiText>Загрузка...</UiText>
            </div>
            <div v-else>
              <div v-if="schedules.length === 0">
                <UiText>Нет расписаний.</UiText>
              </div>
              <UCard v-for="sch in schedules" :key="sch.id" class="mb-2 flex items-center justify-between">
                <div>
                  <UiText>Время: {{ sch.startAt }} - {{ sch.endAt }}</UiText>
                  <UiText>Дата: {{ sch.date }}</UiText>
                </div>
                <div class="flex gap-2">
                  <UButton size="xs" color="primary" variant="soft" @click="openScheduleEditModal(sch)">Редактировать</UButton>
                  <UButton size="xs" color="error" variant="soft" @click="openScheduleDeleteModal(sch)">Удалить</UButton>
                </div>
              </UCard>
              <div class="flex gap-2 mt-2">
                <UButton size="xs" :disabled="scheduleOffset === 0" @click="loadSchedulePrev">Назад</UButton>
                <UButton size="xs" :disabled="schedules.length < scheduleLimit" @click="loadScheduleNext">Вперёд</UButton>
              </div>
            </div>
          </div>
        </template>
      </UTabs>
    </UCard>
    <UModal v-model:open="openEdit" title="Редактировать профиль">
      <template #body>
        <UForm :state="editState" @submit="onEditProfile">
          <UFormField label="Имя пользователя" name="username">
            <UInput v-model="editState.username" />
          </UFormField>
          <UFormField label="Email" name="email">
            <UInput v-model="editState.email" />
          </UFormField>
          <UFormField label="Телефон" name="phoneNumber">
            <UInput v-model="editState.phoneNumber" />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="isLoading">Сохранить</UButton>
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
    <UModal v-model:open="openScheduleCreate" title="Создать расписание">
      <template #body>
        <UForm :state="scheduleFormState" @submit="onCreateSchedule">
          <UFormField label="Дата" name="date" required>
            <UInput v-model="scheduleFormState.date" type="date" required />
          </UFormField>
          <UFormField label="Начало" name="startAt" required>
            <UInput v-model="scheduleFormState.startAt" type="time" required />
          </UFormField>
          <UFormField label="Окончание" name="endAt" required>
            <UInput v-model="scheduleFormState.endAt" type="time" required />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="scheduleLoading">Создать</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openScheduleEdit" title="Редактировать расписание">
      <template #body>
        <UForm :state="scheduleFormState" @submit="onEditSchedule">
          <UFormField label="Дата" name="date" required>
            <UInput v-model="scheduleFormState.date" type="date" required />
          </UFormField>
          <UFormField label="Начало" name="startAt" required>
            <UInput v-model="scheduleFormState.startAt" type="time" required />
          </UFormField>
          <UFormField label="Окончание" name="endAt" required>
            <UInput v-model="scheduleFormState.endAt" type="time" required />
          </UFormField>
          <UButton type="submit" color="primary" class="mt-4" :loading="scheduleLoading">Сохранить</UButton>
        </UForm>
      </template>
    </UModal>
    <UModal v-model:open="openScheduleDelete" title="Удалить расписание?">
      <template #body>
        <UiText>Вы уверены, что хотите удалить расписание?</UiText>
        <div class="flex justify-end gap-2 mt-4">
          <UButton @click="openScheduleDelete = false">Отмена</UButton>
          <UButton color="error" @click="onDeleteSchedule" :loading="scheduleLoading">Удалить</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUserStore } from '~/stores/useUserStore'
import { useSessionStore } from '~/stores/useSessionStore'
import { useUserScheduleStore } from '~/stores/useUserScheduleStore'
import { storeToRefs } from 'pinia'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'
import UserSessions from '~/components/Profile/UserSessions.vue'

const userStore = useUserStore()
const { user, isLoading } = storeToRefs(userStore)
const sessionStore = useSessionStore()
const { sessions, isLoading: sessionsLoading } = storeToRefs(sessionStore)
const userScheduleStore = useUserScheduleStore()
const { schedules, isLoading: scheduleLoading } = storeToRefs(userScheduleStore)

const openEdit = ref(false)
const editState = ref({ username: '', email: '', phoneNumber: '' })
const tab = ref('profile')
const tabs = [
  { label: 'Профиль', value: 'profile', slot: 'profile' as const },
  { label: 'Сессии', value: 'sessions', slot: 'sessions' as const },
  { label: 'Расписание', value: 'schedule', slot: 'schedule' as const }
]

const openAvatarModal = ref(false)
const isAvatarLoading = ref(false)
const avatarFile = ref<File | null>(null)
const avatarFormState = ref({})

const openScheduleCreate = ref(false)
const openScheduleEdit = ref(false)
const openScheduleDelete = ref(false)
const scheduleFormState = ref({ date: '', startAt: '', endAt: '' })
const selectedSchedule = ref<any>(null)

const SESSIONS_LIMIT = 20
const SCHEDULE_LIMIT = 20

const sessionsLimit = ref(SESSIONS_LIMIT)
const sessionsOffset = ref(0)
const scheduleLimit = ref(SCHEDULE_LIMIT)
const scheduleOffset = ref(0)

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
  () => user.value?.id,
  async (id) => {
    if (id) {
      await sessionStore.list({ userId: id, limit: sessionsLimit.value, offset: sessionsOffset.value })
      await userScheduleStore.findByUser(id, { limit: scheduleLimit.value, offset: scheduleOffset.value })
    }
  },
  { immediate: true }
)

const loadSessionsNext = async () => {
  sessionsOffset.value += sessionsLimit.value
  if (user.value?.id) {
    await sessionStore.list({ userId: user.value.id, limit: sessionsLimit.value, offset: sessionsOffset.value })
  }
}
const loadSessionsPrev = async () => {
  sessionsOffset.value = Math.max(0, sessionsOffset.value - sessionsLimit.value)
  if (user.value?.id) {
    await sessionStore.list({ userId: user.value.id, limit: sessionsLimit.value, offset: sessionsOffset.value })
  }
}

const loadScheduleNext = async () => {
  scheduleOffset.value += scheduleLimit.value
  if (user.value?.id) {
    await userScheduleStore.findByUser(user.value.id, { limit: scheduleLimit.value, offset: scheduleOffset.value })
  }
}
const loadSchedulePrev = async () => {
  scheduleOffset.value = Math.max(0, scheduleOffset.value - scheduleLimit.value)
  if (user.value?.id) {
    await userScheduleStore.findByUser(user.value.id, { limit: scheduleLimit.value, offset: scheduleOffset.value })
  }
}

watch(
  () => user.value?.id,
  () => {
    sessionsOffset.value = 0
    scheduleOffset.value = 0
  }
)

const onEditProfile = async () => {
  if (!user.value) return
  await userStore.updateProfile(user.value.id, editState.value)
  openEdit.value = false
}

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  avatarFile.value = files && files[0] ? files[0] : null
}

const onUploadAvatar = async () => {
  if (!user.value || !avatarFile.value) return
  isAvatarLoading.value = true
  try {
    await userStore.uploadProfilePhoto(user.value.id, avatarFile.value)
    openAvatarModal.value = false
    avatarFile.value = null
  } finally {
    isAvatarLoading.value = false
  }
}

const onDeleteAvatar = async () => {
  if (!user.value) return
  await userStore.deleteProfilePhoto(user.value.id)
}

const onLogout = async () => {
  await userStore.logout()
  window.location.href = '/auth/sign-in'
}

const revokeSession = async (sessionId: string) => {
  await sessionStore.revoke({ id: sessionId })
  if (user.value?.id) {
    await sessionStore.list({ userId: user.value.id, limit: sessionsLimit.value, offset: sessionsOffset.value })
  }
}

function openScheduleEditModal(sch: any) {
  selectedSchedule.value = sch
  scheduleFormState.value = { date: sch.date, startAt: sch.startAt, endAt: sch.endAt }
  openScheduleEdit.value = true
}
function openScheduleDeleteModal(sch: any) {
  selectedSchedule.value = sch
  openScheduleDelete.value = true
}

const onCreateSchedule = async () => {
  if (!user.value) return
  await userScheduleStore.createUserSchedule({
    userId: user.value.id,
    ...scheduleFormState.value
  })
  await userScheduleStore.findByUser(user.value.id, { limit: scheduleLimit.value, offset: scheduleOffset.value })
  openScheduleCreate.value = false
  scheduleFormState.value = { date: '', startAt: '', endAt: '' }
}

const onEditSchedule = async () => {
  if (!selectedSchedule.value) return
  await userScheduleStore.updateUserSchedule(selectedSchedule.value.id, {
    ...scheduleFormState.value
  })
  if (user.value) await userScheduleStore.findByUser(user.value.id, { limit: scheduleLimit.value, offset: scheduleOffset.value })
  openScheduleEdit.value = false
  selectedSchedule.value = null
  scheduleFormState.value = { date: '', startAt: '', endAt: '' }
}

const onDeleteSchedule = async () => {
  if (!selectedSchedule.value) return
  await userScheduleStore.deleteUserSchedule(selectedSchedule.value.id)
  if (user.value) await userScheduleStore.findByUser(user.value.id, { limit: scheduleLimit.value, offset: scheduleOffset.value })
  openScheduleDelete.value = false
  selectedSchedule.value = null
}
</script>
