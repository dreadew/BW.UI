<template>
  <div class="min-h-screen flex flex-col bg-secondary/2">
    <div class="flex flex-row flex-1">
      <div class="w-64 border-r border-secondary/10 p-4 hidden md:block flex-col">
        <UNavigationMenu orientation="vertical" :items="navItems" />
        <div class="mt-8 flex justify-center">
          <UToggle v-model="isDark" on-icon="i-lucide-moon" off-icon="i-lucide-sun" @click="toggleTheme" />
        </div>
      </div>
      <USlideover v-model="isSidebarOpen" class="md:hidden">
        <div class="p-4">
          <UNavigationMenu orientation="vertical" :items="navItems" />
        </div>
      </USlideover>
      <button class="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full shadow p-2" @click="isSidebarOpen = !isSidebarOpen">
        <UIcon :name="isSidebarOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="text-2xl" />
      </button>
      <main class="flex-1 p-2 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useColorMode } from '@vueuse/core'

const route = useRoute()
const workspaceId = computed(() => route.params.id)

const navItems = computed(() => {
    const base = [
        { label: 'Все рабочие пространства', to: '/workspace', icon: 'i-lucide-layout-dashboard' }
    ]
    if (workspaceId.value) {
        base.push(
            { label: 'Обзор', to: `/workspace/${workspaceId.value}`, icon: 'i-lucide-home' },
            { label: 'Папки и файлы', to: `/workspace/${workspaceId.value}/admin/directories`, icon: 'i-lucide-folder' },
            { label: 'Роли', to: `/workspace/${workspaceId.value}/admin/roles`, icon: 'i-lucide-users' },
            { label: 'Должности', to: `/workspace/${workspaceId.value}/admin/positions`, icon: 'i-lucide-briefcase' }
        )
    }
    return base
})

const isDark = ref(false)
const colorMode = useColorMode()
const toggleTheme = () => {
  isDark.value = !isDark.value
  colorMode.value = isDark.value ? 'dark' : 'light'
}

const isSidebarOpen = ref(false)

const { isAuthenticated } = useUserStore();
if (!isAuthenticated) {
  await navigateTo('/');
}
</script>
