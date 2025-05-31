<template>
    <div class="min-h-screen flex flex-col bg-secondary/2">
        <div class="flex flex-row flex-1">
            <div class="w-64 border-r border-secondary/10 p-4 hidden md:block flex flex-col">
                <UNavigationMenu orientation="vertical" :items="navItems" />
                <div class="mt-8 flex justify-center">
                    <UToggle v-model="isDark" on-icon="i-lucide-moon" off-icon="i-lucide-sun" @click="toggleTheme" />
                </div>
            </div>
            <main class="flex-1 p-6">
                <ProjectSidebar />
                <!-- основной контент страницы -->
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import UiHeading from '~/components/Ui/Heading.vue'
import ProjectSidebar from '~/components/Project/ProjectSidebar.vue'
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
</script>
