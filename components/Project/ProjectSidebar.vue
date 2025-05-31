<template>
  <aside class="w-64 bg-secondary/2 border-r border-r-secondary/10 h-full flex flex-col">
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li>
          <NuxtLink :to="`/project/${projectId}`" class="flex items-center gap-2">
            <UIcon name="i-lucide-layout-dashboard" />
            <span>Обзор</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="`/project/${projectId}/threads`" class="flex items-center gap-2">
            <UIcon name="i-lucide-message-square" />
            <span>Треды</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="`/project/${projectId}/sections`" class="flex items-center gap-2">
            <UIcon name="i-lucide-columns-3" />
            <span>Секции</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="`/project/${projectId}/tasks`" class="flex items-center gap-2">
            <UIcon name="i-lucide-list-todo" />
            <span>Задачи</span>
          </NuxtLink>
          <ul class="ml-6 mt-2 space-y-1">
            <li v-for="task in tasks" :key="task.id">
              <NuxtLink :to="`/project/${projectId}/tasks/${task.id}`" class="flex items-center gap-2 text-sm">
                <UIcon name="i-lucide-circle" />
                <span>{{ task.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
      <div class="mt-8 flex justify-center">
        <UToggle v-model="isDark" on-icon="i-lucide-moon" off-icon="i-lucide-sun" @click="toggleTheme" />
      </div>
    </nav>
  </aside>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTaskStore } from '~/stores/useTaskStore'
import { ref, onMounted } from 'vue'
import { useColorMode } from '@vueuse/core'
const route = useRoute()
const projectId = route.params.id
const taskStore = useTaskStore()
const tasks = ref([])
const isDark = ref(false)
const colorMode = useColorMode()
onMounted(async () => {
  tasks.value = await taskStore.listByProject(projectId)
})
const toggleTheme = () => {
  isDark.value = !isDark.value
  colorMode.value = isDark.value ? 'dark' : 'light'
}
</script>
