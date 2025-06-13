<template>
    <BaseRepositoryTree :object-id="taskId" :store="directoryStore" :show-root-create="true" />
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useTaskDirectoryStore } from '~/stores/useTaskDirectoryStore'

const route = useRoute()
const taskId = computed(() => route.params.taskId as string)
const directoryStore = useTaskDirectoryStore()
directoryStore.taskId = taskId.value

await directoryStore.list()
</script>
