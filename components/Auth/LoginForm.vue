<template>
  <UForm :state="state" @submit="onSubmit" :schema="schema" class="space-y-4">
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
      <span class="text-primary font-medium hover:underline ml-1 cursor-pointer"
        @click="onRegisterClick">Зарегистрироваться</span>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/useUserStore'
import { storeToRefs } from 'pinia'
import { signInRequestSchema } from '~/schemas/generated.schema'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from '#app'

const emit = defineEmits(['openRegister']);
const props = defineProps({
  asModal: {
    type: Boolean,
    default: false
  }
});

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)
const state = ref({ username: '', password: '', rememberMe: false })
const schema = toTypedSchema(signInRequestSchema)
const router = useRouter()

const onSubmit = async () => {
  const success = await userStore.login(state.value)
  if (success) router.push('/')
}

const onRegisterClick = () => {
  if (props.asModal) {
    emit('openRegister');
  } else {
    router.push('/auth/sign-up');
  }
}
</script>
