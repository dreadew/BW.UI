<template>
      <UForm :state="state" @submit="onSubmit" :schema="schema" class="space-y-4">
        <UFormField label="Логин" name="username" required>
          <UInput required class="w-full" v-model="state.username" placeholder="Введите логин" size="xl" autofocus />
        </UFormField>
        <UFormField label="Email" name="email" required>
          <UInput required class="w-full" v-model="state.email" placeholder="Введите email" size="lg" icon="i-lucide-at-sign" />
        </UFormField>
        <UFormField label="Телефон" name="phoneNumber" required>
          <UInput required class="w-full" v-model="state.phoneNumber" placeholder="Введите телефон" size="lg" />
        </UFormField>
        <UFormField label="Пароль" name="password" required>
          <UInput required class="w-full" v-model="state.password" type="password" placeholder="Введите пароль" size="lg" />
        </UFormField>
        <UFormField name="agree">
          <UCheckbox required v-model="state.agree">
            <template #label>
                Я согласен с <span class="text-primary cursor-pointer underline" @click="showModal = true">
                    <UModal v-model:open="showModal" title="Правила и соглашения">
                        <UButton class="px-0 py-0" variant="link">Правилами</UButton>
                        <template #body>
                            <ul class="list-disc pl-5 space-y-2">
                                <li>Вы соглашаетесь соблюдать правила платформы.</li>
                                <li>Ваши данные будут храниться в соответствии с политикой конфиденциальности.</li>
                                <li>Запрещено использовать сервис в незаконных целях.</li>
                                <li>...</li>
                            </ul>
                        </template>
                        <template #footer>
                            <UButton @click="showModal = false">Закрыть</UButton>
                        </template>
                    </UModal>
                </span>
            </template>
          </UCheckbox>
        </UFormField>
        <div class="mt-4 text-center text-sm text-gray-500">
          Уже есть аккаунт?
          <NuxtLink to="/login" class="text-primary font-medium hover:underline ml-1">Войти</NuxtLink>
        </div>
      </UForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/useUserStore'
import { storeToRefs } from 'pinia'
import { signUpRequestSchema } from '~/schemas/generated.schema'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)
const showModal = ref(false)

const schema = signUpRequestSchema.extend({
    agree: z.literal(true, { errorMap: () => ({ message: 'Необходимо согласиться с правилами' }) })
});
const state = reactive<Partial<z.output<typeof schema>>>({
    email: '',
    phoneNumber: '',
    username: '',
    password: ''
});

const onSubmit = async () => {
  const { agree, ...userData } = state;
  const success = await userStore.register(userData)
  if (success) window.location.href = '/login'
}
</script>
