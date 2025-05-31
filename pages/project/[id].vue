<template>
  <div>
    <UiHeading size="2xl" class="mb-6">Проект</UiHeading>
    <div v-if="!project">
      <UiText>Загрузка...</UiText>
    </div>
    <div v-else>
      <UCard class="mb-6">
        <UiHeading size="lg">{{ project.name }}</UiHeading>
        <UiText>ID: {{ project.id }}</UiText>
        <UiText>Создано: {{ project.createdAt }}</UiText>
        <UiText>Описание: {{ project.description }}</UiText>
      </UCard>
      <div class="flex gap-4 mb-4">
        <NuxtLink :to="`/project/${project.id}/threads`">
          <UButton color="primary" variant="soft">Треды</UButton>
        </NuxtLink>
        <NuxtLink :to="`/project/${project.id}/sections`">
          <UButton color="primary" variant="soft">Секции</UButton>
        </NuxtLink>
        <NuxtLink :to="`/project/${project.id}/tasks`">
          <UButton color="primary" variant="soft">Задачи</UButton>
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <UCard>
          <UiHeading size="md">Секции</UiHeading>
          <UiText>Быстрый доступ к секциям проекта и канбан-доске.</UiText>
          <NuxtLink :to="`/project/${project.id}/sections`">
            <UButton color="primary" class="mt-4">Перейти к секциям</UButton>
          </NuxtLink>
        </UCard>
        <UCard>
          <UiHeading size="md">Задачи</UiHeading>
          <UiText>Просмотр и управление задачами проекта.</UiText>
          <NuxtLink :to="`/project/${project.id}/tasks`">
            <UButton color="primary" class="mt-4">Перейти к задачам</UButton>
          </NuxtLink>
        </UCard>
        <UCard>
          <UiHeading size="md">Треды</UiHeading>
          <UiText>Обсуждения и комментарии по проекту.</UiText>
          <NuxtLink :to="`/project/${project.id}/threads`">
            <UButton color="primary" class="mt-4">Перейти к тредам</UButton>
          </NuxtLink>
        </UCard>
      </div>
      <!-- Здесь будут секции, задачи, треды и т.д. -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useProjectStore } from '~/stores/useProjectStore'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const route = useRoute()
const projectStore = useProjectStore()
const { currentProject: project, isLoading } = storeToRefs(projectStore)

onMounted(async () => {
  await projectStore.getById(route.params.id)
})
</script>

<route>
{
  "layout": "workspace"
}
</route>
