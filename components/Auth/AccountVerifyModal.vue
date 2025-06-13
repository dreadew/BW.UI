<template>
  <UModal v-model:open="showVerifyModal" :closable="false" :maskClosable="false" :escClosable="false"
    title="Подтвердите аккаунт">
    <template #body>
      <div class="space-y-4">
        <div>
          <UiText color="darker-neutral">Для продолжения работы подтвердите ваш аккаунт. Введите код, отправленный на
            email <b>{{ userStore.user?.email }}</b>.</UiText>
        </div>
        <UForm class="flex flex-col items-center" @submit="onSubmitVerify" :state="verifyFormState">
          <UPinInput v-model="verifyFormState.code" otp :length="6" class="mb-2" />
          <div class="mt-2 flex self-end gap-2 items-center">
            <UButton type="button" color="neutral" variant="ghost" class="w-full" :loading="userStore.loading"
              @click="onGenerateCode">
              Запросить новый код</UButton>
            <UButton type="submit" color="primary" :loading="userStore.loading">
              Подтвердить</UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '~/stores/useUserStore'
import { notificationTypes } from '~/types/request.types'

const userStore = useUserStore()
const showVerifyModal = computed(() => !!userStore.user && !userStore.user.isVerified)
const verifyFormState = ref({ code: Array(6).fill('') })

async function onGenerateCode() {
  if (!userStore.user) return
  await userStore.generateVerificationCode({ email: userStore.user.email, type: notificationTypes.ACCOUNT_CONFIRMATION })
}

async function onSubmitVerify() {
  if (!userStore.user) return
  const codeRaw = verifyFormState.value.code.join('')
  const code = codeRaw.replace(/(\d{3})(\d{3})/, '$1-$2')
  await userStore.verify({ id: userStore.user.id, code, type: notificationTypes.ACCOUNT_CONFIRMATION })
  verifyFormState.value.code = Array(6).fill('')
  await userStore.fetchCurrentUser()
}
</script>
