<template>
  <div>
    <UiHeading size="2xl" class="mb-6">Профиль пользователя</UiHeading>
    <UCard v-if="user">
      <div class="flex items-center gap-6 mb-6">
        <img v-if="user.photoUrl" :src="user.photoUrl" class="w-24 h-24 rounded-full object-cover" alt="Аватар" />
        <div>
          <UiHeading size="lg">{{ user.username }}</UiHeading>
          <UiText color="gray">{{ user.email }}</UiText>
          <UiText color="gray">ID: {{ user.id }}</UiText>
        </div>
        <div class="ml-auto flex gap-2">
          <UButton color="primary" @click="openEdit = true">Редактировать</UButton>
          <UButton color="danger" @click="onLogout">Выйти</UButton>
        </div>
      </div>
      <UTabs v-model="tab" :items="tabs">
        <template #default="{ item }">
          <div v-if="item.value === 'profile'">
            <UiHeading size="md" class="mb-2">Информация</UiHeading>
            <UiText>Имя пользователя: {{ user.username }}</UiText>
            <UiText>Email: {{ user.email }}</UiText>
            <UiText>Телефон: {{ user.phoneNumber }}</UiText>
          </div>
          <div v-else-if="item.value === 'sessions'">
            <UiHeading size="md" class="mb-2">Сессии</UiHeading>
            <UserSessions :userId="user.id" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUserStore } from '~/stores/useUserStore'
import { storeToRefs } from 'pinia'
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'
import UserSessions from '~/components/Profile/UserSessions.vue'

const userStore = useUserStore()
const { user, isLoading } = storeToRefs(userStore)
const openEdit = ref(false)
const editState = ref({ username: '', email: '', phoneNumber: '' })
const tab = ref('profile')
const tabs = [
  { label: 'Профиль', value: 'profile' },
  { label: 'Сессии', value: 'sessions' }
]

watch(openEdit, (val) => {
  if (val && user.value) {
    editState.value = {
      username: user.value.username,
      email: user.value.email,
      phoneNumber: user.value.phoneNumber || ''
    }
  }
})

const onEditProfile = async () => {
  if (!user.value) return
  await userStore.updateProfile(user.value.id, editState.value)
  openEdit.value = false
}

const onLogout = async () => {
  await userStore.logout()
  window.location.href = '/auth/sign-in'
}
</script>
