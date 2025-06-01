<template>
  <div class="max-w-4xl mx-auto py-12 px-4">
    <UiHeading size="3xl" class="mb-6 flex items-center gap-2">
      <UIcon name="i-lucide-flame" class="text-primary" /> Demo Page
    </UiHeading>
    <UiText color="neutral" class="mb-8 text-lg">
      Добро пожаловать на демонстрационную страницу HexaEnd! Здесь вы можете увидеть примеры компонентов, карточек, кнопок и элементов интерфейса.
    </UiText>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <UCard>
        <template #header>
          <UIcon name="i-lucide-sparkles" class="text-xl text-primary mr-2" />
          <span>Возможности</span>
        </template>
        <UiText>Используйте карточки, кнопки, иконки и другие элементы Nuxt UI для создания современных интерфейсов.</UiText>
        <UButton color="primary" class="mt-4" icon="i-lucide-arrow-right">Подробнее</UButton>
      </UCard>
      <UCard>
        <template #header>
          <UIcon name="i-lucide-users" class="text-xl text-primary mr-2" />
          <span>Команда</span>
        </template>
        <UiText>Покажите участников команды с помощью карточек, аватаров и списков.</UiText>
        <UButton color="primary" variant="outline" class="mt-4" icon="i-lucide-user">Смотреть</UButton>
      </UCard>
      <UCard>
        <template #header>
          <UIcon name="i-lucide-check-circle" class="text-xl text-primary mr-2" />
          <span>Успех</span>
        </template>
        <UiText>Используйте уведомления, чтобы информировать пользователя об успешных действиях.</UiText>
        <UButton color="success" class="mt-4" icon="i-lucide-badge-check">Уведомить</UButton>
      </UCard>
      <UCard>
        <template #header>
          <UIcon name="i-lucide-moon" class="text-xl text-primary mr-2" />
          <span>Темная тема</span>
        </template>
        <UiText>Включите тёмную тему для современного вида и комфорта глаз.</UiText>
        <UButton color="neutral" class="mt-4" icon="i-lucide-moon">Переключить тему</UButton>
      </UCard>
    </div>
    <div class="flex flex-col md:flex-row gap-6 items-center justify-center mt-8">
      <UButton color="primary" size="lg" icon="i-lucide-rocket">Начать</UButton>
      <UButton color="neutral" size="lg" variant="outline" icon="i-lucide-book">Документация</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiHeading from '~/components/Ui/Heading.vue'
import UiText from '~/components/Ui/Text.vue'
useHead({ title: 'Демо' })
</script>
