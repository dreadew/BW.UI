<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { ref } from 'vue';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';

const items = ref<NavigationMenuItem[]>([
    {
        label: 'Главная',
        to: '/'
    },
    {
        label: 'Профиль',
        to: '/profile'
    },
    {
        label: 'Настройки',
        to: '/settings'
    },
    {
        label: 'Сообщения',
        to: '/messages'
    },
    {
        label: 'Помощь',
        to: '/help'
    }
]);

const showLogin = ref(false);
const showRegister = ref(false);
const loginFormRef = ref()
const registerFormRef = ref()
</script>

<template>
  <div class="flex items-center gap-4 w-full justify-center">
    <UNavigationMenu :items="items" class="flex-1" />
    <UButton color="primary" variant="soft" @click="showLogin = true">Войти</UButton>
    <UButton color="primary" variant="outline" @click="showRegister = true">Зарегистрироваться</UButton>
    <UModal v-model:open="showLogin" title="Вход">
        <template #header>
            <h2 class="text-lg font-semibold">Вход в систему</h2>
        </template>
        <template #description>
            <p class="text-sm text-gray-500">Введите свои данные для входа</p>
        </template>
        <template #body>
            <LoginForm ref="loginFormRef" @success="showLogin = false" />
        </template>
        <template #footer>
            <UButton @click="loginFormRef?.submitForm()" type="submit" size="lg" block>Войти</UButton>
        </template>
    </UModal>
    <UModal v-model:open="showRegister" title="Регистрация">
        <template #header>
            <h2 class="text-2xl font-bold">Регистрация</h2>
        </template>
        <template #description>
            <p class="text-gray-500 mt-1">Заполните все поля для создания аккаунта</p>
        </template>
        <template #body>
            <RegisterForm ref="registerFormRef" @success="showRegister = false" />
        </template>
        <template #footer>
            <UButton @click="registerFormRef?.submitForm()" type="submit" size="lg" block>Зарегистрироваться</UButton>
        </template>
    </UModal>
  </div>
</template>