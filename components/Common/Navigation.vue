<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { ref } from 'vue';
import { useColorMode } from '@vueuse/core'

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Главная',
    to: '/',
    icon: 'i-lucide-home'
  },
  {
    label: 'О нас',
    icon: 'i-lucide-info',
    children: [
      { label: 'Наша история', to: '/about', icon: 'i-lucide-book-open' },
      { label: 'Ценности', to: '/about#values', icon: 'i-lucide-heart' },
      { label: 'Команда', to: '/about#team', icon: 'i-lucide-users' }
    ]
  },
  {
    label: 'Продукт',
    icon: 'i-lucide-box',
    children: [
      { label: 'Особенности', to: '/features', icon: 'i-lucide-star' },
      { label: 'Цены', to: '/pricing', icon: 'i-lucide-dollar-sign' },
      { label: 'Дорожная карта', to: '/roadmap', icon: 'i-lucide-map' }
    ]
  },
  {
    label: 'Ресурсы',
    icon: 'i-lucide-folder',
    children: [
      { label: 'Блог', to: '/blog', icon: 'i-lucide-edit' },
      { label: 'Контакты', to: '/contact', icon: 'i-lucide-phone' }
    ]
  },
  {
    label: 'Юридическое',
    icon: 'i-lucide-shield',
    children: [
      { label: 'Приватность', to: '/privacy', icon: 'i-lucide-lock' },
      { label: 'Правила', to: '/terms', icon: 'i-lucide-file-text' }
    ]
  }
]);

const showLogin = ref(false);
const showRegister = ref(false);

const onOpenRegister = () => {
  showLogin.value = false;
  showRegister.value = true;
}

const onOpenLogin = () => {
  showRegister.value = false;
  showLogin.value = true;
}

const isDark = ref(false)
const colorMode = useColorMode()
const toggleTheme = () => {
  isDark.value = !isDark.value
  colorMode.value = isDark.value ? 'dark' : 'light'
}
</script>

<template>
  <div class="border border-secondary/10 bg-secondary/2 rounded-2xl py-2 px-3 my-4 flex items-center gap-4 justify-center">
    <UNavigationMenu :items="items" class="flex-1" />
    <UToggle v-model="isDark" on-icon="i-lucide-moon" off-icon="i-lucide-sun" @click="toggleTheme" class="mr-2" />
    <UButton color="primary" variant="soft" @click="showLogin = true">
      <UIcon name="i-lucide-log-in" class="mr-1" /> Войти
    </UButton>
    <UButton color="primary" variant="outline" @click="showRegister = true">
      <UIcon name="i-lucide-user-plus" class="mr-1" /> Зарегистрироваться
    </UButton>
    <UModal v-model:open="showLogin" title="Вход">
      <template #header>
        <UiHeading level="5">
          <UIcon name="i-lucide-log-in" class="mr-1" /> Вход в систему
        </UiHeading>
      </template>
      <template #description>
        <UiText>
          Введите свои данные для входа
        </UiText>
      </template>
      <template #body>
        <AuthLoginForm asModal @success="showLogin = false" @openRegister="onOpenRegister" />
      </template>
    </UModal>
    <UModal v-model:open="showRegister" title="Регистрация">
      <template #header>
        <UiHeading level="5">
          <UIcon name="i-lucide-user-plus" class="mr-1" /> Регистрация
        </UiHeading>
      </template>
      <template #description>
        <UiText>
          Заполните все поля для создания аккаунта
        </UiText>
      </template>
      <template #body>
        <AuthRegisterForm asModal @success="showRegister = false" @openLogin="onOpenLogin" />
      </template>
    </UModal>
  </div>
</template>