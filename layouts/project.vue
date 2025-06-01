<template>
  <div class="min-h-screen flex flex-col bg-secondary/2">
    <div class="flex flex-row flex-1">
      <div class="w-64 border-r border-secondary/10 p-4 hidden md:block flex-col">
        <ProjectSidebar />
      </div>
      <USlideover v-model="isSidebarOpen" class="md:hidden">
        <div class="p-4"><ProjectSidebar /></div>
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
import { ref } from 'vue'
import ProjectSidebar from '~/components/Project/ProjectSidebar.vue'
const isSidebarOpen = ref(false)

const { isAuthenticated } = useUserStore();
if (!isAuthenticated) {
  await navigateTo('/');
}
</script>
