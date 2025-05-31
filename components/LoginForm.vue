<template>
      <UForm ref="formRef" :state="state" @submit="onSubmit" :schema="schema" class="space-y-4">
        <UFormField label="Логин" name="username" required>
          <UInput required class="w-full" v-model="state.username" placeholder="Введите логин" size="xl" autofocus />
        </UFormField>
        <UFormField label="Пароль" name="password" required>
          <UInput required class="w-full" v-model="state.password" type="password" placeholder="Введите пароль" size="xl" />
        </UFormField>
        <UFormField>
            <UCheckbox v-model="state.rememberMe" label="Запомнить меня" />
        </UFormField>
        <UButton type="submit" :loading="isLoading" size="lg" block class="mt-2">Войти</UButton>
        <div class="mt-4 text-center text-sm text-gray-500">
          Нет аккаунта?
          <NuxtLink to="/register" class="text-primary font-medium hover:underline ml-1">Зарегистрироваться</NuxtLink>
        </div>
      </UForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/useUserStore'
import { storeToRefs } from 'pinia'
import { signInRequestSchema } from '~/schemas/generated.schema'
import { toTypedSchema } from '@vee-validate/zod'

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)
const state = ref({ username: '', password: '', rememberMe: false })
const schema = toTypedSchema(signInRequestSchema)
const formRef = ref()

const onSubmit = async () => {
  const success = await userStore.login(state.value)
  if (success) window.location.href = '/'
}
</script>
