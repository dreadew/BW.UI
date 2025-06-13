<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex flex-col flex-1">
      <main class="flex-1 space-y-4 p-2 md:p-6">
        <UBreadcrumb :items="breadcrumbs">
          <template #separator>
            <span class="mx-2 text-muted">/</span>
          </template>
        </UBreadcrumb>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '~/stores/useUserStore'
import type { BreadcrumbItem } from '@nuxt/ui'

const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.replace('/')
  }
})

watch(() => userStore.isAuthenticated, (val) => {
  if (!val) {
    router.replace('/')
  }
})

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const threadId = computed(() => route.params.threadId as string)

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const crumbs: BreadcrumbItem[] = [
    { label: 'Рабочие пространства', to: '/workspace' }
  ]
  if (projectId) {
    crumbs.push({ label: `Проект`, to: `/project/${projectId.value}` })
    if (route.name === 'project-id-threads' || route.path.includes('/threads')) {
      if (threadId) {
        crumbs.push({ label: 'Тред', to: `/project/${projectId}/threads/${threadId.value}` })
      }
    }
    if (route.name === 'project-id-sections' || route.path.includes('/sections')) {
      crumbs.push({ label: 'Секции', to: `/project/${projectId.value}/sections` })
    }
    if (route.name === 'project-id-tasks' || route.path.includes('/tasks')) {
      crumbs.push({ label: 'Задачи', to: `/project/${projectId.value}/tasks` })
    }
    if (route.name === 'project-id-roles' || route.path.includes('/roles')) {
      crumbs.push({ label: 'Роли', to: `/project/${projectId.value}/roles` })
    }
  }
  return crumbs
})
</script>
