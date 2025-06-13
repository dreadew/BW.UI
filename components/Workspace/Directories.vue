<template>
    <BaseRepositoryTree :object-id="workspaceId" :store="directoryStore" />
</template>
<script setup lang="ts">
definePageMeta({ layout: 'workspace' })
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWorkspaceDirectoryStore } from '~/stores/useWorkspaceDirectoryStore'

useHead({ title: 'Папки и файлы' })
const route = useRoute()
const workspaceId = computed(() => route.params.id as string)
const directoryStore = useWorkspaceDirectoryStore()
directoryStore.workspaceId = workspaceId.value

await directoryStore.list()
</script>
