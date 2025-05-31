<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
    <UFormField label="Логин" name="username" required>
      <UInput required class="w-full" v-model="state.username" placeholder="Введите логин" size="xl" autofocus />
    </UFormField>
    <UFormField label="Email" name="email" required>
      <UInput required class="w-full" v-model="state.email" placeholder="Введите эл. почту" size="lg" icon="i-lucide-at-sign" />
    </UFormField>
    <UFormField label="Телефон" name="phoneNumber" required>
      <UInput
        required
        class="w-full"
        v-model="state.phoneNumber"
        placeholder="Введите телефон"
        size="lg"
        :rules="[value => PHONE_NUMBER.test(value) || 'Введите корректный номер телефона']"
      />
    </UFormField>
    <UFormField label="Пароль" name="password" required>
      <UInput required class="w-full" v-model="state.password" placeholder="Введите пароль" size="lg" />
    </UFormField>
    <UFormField name="agree">
      <UCheckbox required v-model="state.agree">
        <template #label>
          Я согласен с <span class="text-primary cursor-pointer underline" @click="showModal = true">
            <UModal v-model:open="showModal" title="Правила и соглашения">
              <UButton class="px-0 py-0" variant="link">Правилами</UButton>
              <template #body>
                <LegalTermsContent />
              </template>
              <template #footer>
                <UButton @click="showModal = false">Закрыть</UButton>
              </template>
            </UModal>
          </span>
        </template>
      </UCheckbox>
    </UFormField>
    <UButton type="submit" :loading="isLoading" size="lg" block class="mt-2">Зарегистрироваться</UButton>
    <div class="mt-4 text-center text-sm text-gray-500">
      Уже есть аккаунт?
      <span class="text-primary font-medium hover:underline ml-1 cursor-pointer" @click="onLoginClick">Войти</span>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '~/stores/useUserStore'
import { storeToRefs } from 'pinia'
import { signUpRequestSchema } from '~/schemas/generated.schema'
import { z } from 'zod'
import { useRouter } from '#app'
import { PHONE_NUMBER } from '~/constants/regexp.constants'

const emit = defineEmits(['openLogin', 'successRegister']);
const props = defineProps({
  asModal: {
    type: Boolean,
    default: false
  }
});

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)
const showModal = ref(false)
const router = useRouter()

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
  const success = await userStore.register(userData);
  if (success) {
    if (props.asModal) {
      router.push('/auth/sign-in');
      return;
    }
    emit('successRegister');
  }
}

const onLoginClick = () => {
  if (props.asModal) {
    emit('openLogin');
  } else {
    router.push('/auth/sign-in');
  }
}
</script>
