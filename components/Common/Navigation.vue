<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { ref, computed } from 'vue'
import { useColorMode } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/useUserStore'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)
const logout = userStore.logout

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

const AuthorizedLinks = ref<NavigationMenuItem[]>([
  {
    label: 'Профиль',
    icon: 'i-lucide-user',
    to: '/profile'
  },
  {
    label: 'Пространства',
    icon: 'i-lucide-grid',
    to: '/workspace'
  },
  {
    label: 'Проекты',
    icon: 'i-lucide-briefcase',
    to: '/project'
  }
])

const showLogin = ref(false);
const showRegister = ref(false);
const isMobileMenuOpen = ref(false)

const onOpenRegister = () => {
  showLogin.value = false;
  showRegister.value = true;
}

const onOpenLogin = () => {
  showRegister.value = false;
  showLogin.value = true;
}

const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (val: boolean) => { colorMode.value = val ? 'dark' : 'light' }
})
const toggleTheme = () => {
  isDark.value = !isDark.value
}

const route = useRoute()

function isActive(item: NavigationMenuItem): boolean {
  if (!item.to) return false
  return route.path === item.to || route.fullPath === item.to
}

function isChildActive(children: NavigationMenuItem[] = []): boolean {
  return children.some((child: NavigationMenuItem) => isActive(child))
}

const computedItems = computed(() => items.value)
</script>

<template>
  <div class="sticky top-4 z-30 backdrop-blur w-full px-0 md:px-0">
    <div class="border border-secondary/10 rounded-2xl py-2 px-3 my-4 flex items-center gap-4 justify-between relative max-w-7xl mx-auto">
      <NuxtLink to="/" class="flex items-center gap-2 mr-2 select-none">
        <img src="/assets/img/128.svg" alt="Hexaend Logo" class="h-8 w-8" />
      </NuxtLink>
      <div class="hidden xl:flex flex-1">
        <UNavigationMenu :items="isAuthenticated ? [...computedItems, ...AuthorizedLinks] : computedItems" class="flex-1" />
      </div>
      <div class="flex gap-2 items-center">
        <UButton v-if="!isAuthenticated" color="primary" variant="soft" @click="showLogin = true" class="hidden xl:flex">
          <UIcon name="i-lucide-log-in" class="mr-1" /> Войти
        </UButton>
        <UButton v-if="!isAuthenticated" color="primary" variant="outline" @click="showRegister = true" class="hidden xl:flex">
          <UIcon name="i-lucide-user-plus" class="mr-1" /> Зарегистрироваться
        </UButton>
        <UButton v-if="isAuthenticated" color="neutral" variant="subtle" @click="logout" trailing-icon="i-lucide-user-plus" class="hidden xl:flex">
          Выйти
        </UButton>
        <USlideover v-model="isMobileMenuOpen" class="xl:hidden">
          <UButton class="xl:hidden" variant="ghost" color="neutral" icon="i-lucide-menu" aria-label="Закрыть меню" />
          <template #content>
            <div class="p-4">
              <UNavigationMenu :items="isAuthenticated ? [...computedItems, ...AuthorizedLinks] : computedItems" orientation="vertical" />
              <div class="mt-4 flex flex-col gap-2">
                <UButton v-if="!isAuthenticated" color="primary" variant="soft" @click="showLogin = true">
                  <UIcon name="i-lucide-log-in" class="mr-1" /> Войти
                </UButton>
                <UButton v-if="!isAuthenticated" color="primary" variant="outline" @click="showRegister = true">
                  <UIcon name="i-lucide-user-plus" class="mr-1" /> Зарегистрироваться
                </UButton>
                <UButton v-if="isAuthenticated" color="neutral" variant="subtle" @click="logout" trailing-icon="i-lucide-user-plus">
                  Выйти
                </UButton>
              </div>
            </div>
          </template>
        </USlideover>
          <UButton
            color="neutral"
            variant="subtle"
            class="mr-2"
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            @click="toggleTheme"
            aria-label="Переключить тему"
          />
      </div>
    </div>
    <UModal v-if="!isAuthenticated" v-model:open="showLogin" title="Вход">
      <template #header>
        <UiHeading class="flex items-center gap-2" level="5">
          <UIcon name="i-lucide-log-in" /> Вход в систему
        </UiHeading>
      </template>
      <template #description>
        <UiText>
          Введите свои данные для входа
        </UiText>
      </template>
      <template #body>
        <AuthLoginForm asModal @success="showLogin = false" @openRegister="onOpenRegister" @success-auth="showLogin = false" />
      </template>
    </UModal>
    <UModal v-if="!isAuthenticated" v-model:open="showRegister" title="Регистрация">
      <template #header>
        <UiHeading class="flex items-center gap-2" level="5">
          <UIcon name="i-lucide-user-plus" /> Регистрация
        </UiHeading>
      </template>
      <template #description>
        <UiText>
          Заполните все поля для создания аккаунта
        </UiText>
      </template>
      <template #body>
        <AuthRegisterForm asModal @success="showRegister = false" @openLogin="onOpenLogin" @success-register="onOpenLogin" />
      </template>
    </UModal>
  </div>
</template>