<template>
    <div class="kanban-layout flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div class="flex-1 px-2 md:px-8 py-8 max-w-7xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Канбан-доска</h1>
                <UButton color="primary" icon="i-heroicons-plus" @click="openSectionDialog()">Создать секцию</UButton>
            </div>
            <div class="kanban-board grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                <KanbanColumn v-for="section in sections" :key="section.id" :section="section"
                    @edit="openSectionDialog(section)" @delete="openDeleteSectionDialog(section)"
                    @add-task="openTaskDialog(section)" />
            </div>
        </div>
        <KanbanDialogs v-bind="dialogsState" @close="closeAllDialogs" @save-section="handleSaveSection"
            @delete-section="handleDeleteSection" @save-task="handleSaveTask" />
        <UNotifications />
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import KanbanColumn from '~/components/test-ui/KanbanColumn.vue'
import KanbanDialogs from '~/components/test-ui/KanbanDialogs.vue'
import type { SectionDto } from '~/types/request.types'

const sections = ref<SectionDto[]>([])
const dialogsState = reactive({
    showSection: false,
    showDeleteSection: false,
    showTask: false,
    section: null,
    task: null,
})
function openSectionDialog(section = null) {
    dialogsState.showSection = true
    dialogsState.section = section
}
function openDeleteSectionDialog(section) {
    dialogsState.showDeleteSection = true
    dialogsState.section = section
}
function openTaskDialog(section) {
    dialogsState.showTask = true
    dialogsState.section = section
    dialogsState.task = null
}
function closeAllDialogs() {
    Object.keys(dialogsState).forEach(k => {
        if (typeof dialogsState[k] === 'boolean') dialogsState[k] = false
        else dialogsState[k] = null
    })
}
function handleSaveSection(section) {/* ... */ }
function handleDeleteSection(section) {/* ... */ }
function handleSaveTask(task) {/* ... */ }
</script>
