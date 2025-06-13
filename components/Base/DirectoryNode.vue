<template>
    <div class="flex items-center justify-between gap-2 py-1 hover:bg-gray-50 rounded group/directory">
            <div class="flex items-center gap-2 cursor-pointer select-none flex-1 min-w-0" @click="toggleOpen"
                tabindex="0" @keydown.enter.space="toggleOpen">
                <UIcon :name="isOpen ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
                    class="text-muted w-4 h-4 flex-shrink-0" />
                <UIcon name="i-heroicons-folder" class="text-primary w-5 h-5 flex-shrink-0" />
                <UiText color="primary" weight="semibold">{{ directory.name }}</UiText>
            </div>
            <div class="flex gap-1 opacity-0 group-hover/directory:opacity-100 transition-opacity">
                <UButton size="xs" variant="ghost" color="neutral" icon="i-heroicons-plus" @click.stop="$emit('open-create', directory)" />
                <UButton size="xs" variant="ghost" color="neutral" icon="i-heroicons-pencil" @click.stop="$emit('open-rename', directory)" />
                <UButton size="xs" variant="ghost" color="error" icon="i-heroicons-trash" @click.stop="$emit('open-delete', directory)" />
                <UButton size="xs" variant="ghost" color="neutral" icon="i-heroicons-arrow-up-tray" @click.stop="$emit('upload-file', directory)" />
            </div>
        </div>
        <ul v-if="isOpen && directory.artifacts && directory.artifacts.length"
            class="ml-7 border-l border-muted pl-4 mt-1">
            <li v-for="artifact in directory.artifacts" :key="artifact.id"
                class="flex items-center justify-between gap-2 mb-1 py-1 hover:bg-muted rounded group/artifact">
                <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-document" class="text-muted w-4 h-4" />
                    <UiText weight="medium" color="darker-neutral">{{ artifact.name }}</UiText>
                </div>
                <div class="opacity-0 group-hover/artifact:opacity-100 transition-opacity">
                    <UButton size="xs" color="error" variant="ghost" icon="i-heroicons-trash" @click.stop="$emit('delete-file', { directory, artifact })" />
                </div>
            </li>
        </ul>
        <ul v-if="isOpen && directory.children && directory.children.length" class="ml-5 mt-1">
            <DirectoryNode v-for="child in directory.children" :key="child.id" :directory="child"
                @open-create="$emit('open-create', $event)" @open-rename="$emit('open-rename', $event)"
                @open-delete="$emit('open-delete', $event)" @upload-file="$emit('upload-file', $event)"
                @delete-file="$emit('delete-file', $event)" />
    </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BaseDirectoryDto } from '~/types/request.types'
const props = defineProps<{ directory: BaseDirectoryDto }>()
const isOpen = ref(false)
function toggleOpen() {
    isOpen.value = !isOpen.value
}
</script>
