<template>
    <div>
        <BaseGrid without-heading :store="taskStore" :columns="columns" editable :custom-list-fn="taskStore.listByUser"
            is-readonly />
    </div>
</template>
<script setup lang="ts">
import type { TableRow } from '@nuxt/ui'
import { onMounted } from 'vue'
import { useTaskStore } from '~/stores/useTaskStore'
import type { TaskDto } from '~/types/request.types'

const taskStore = useTaskStore()
const columns = [
    { accessorKey: 'name', header: 'Название', cell: ({ row }: { row: TableRow<TaskDto> }) => row.original.name ?? '' },
    { accessorKey: 'content', header: 'Описание', cell: ({ row }: { row: TableRow<TaskDto> }) => row.original.content ?? '' },
    { accessorKey: 'priorityType.name', header: 'Приоритет', cell: ({ row }: { row: TableRow<TaskDto> }) => row.original.priorityType?.name ?? '' },
    { accessorKey: 'startedDate', header: 'Дата начала', cell: ({ row }: { row: TableRow<TaskDto> }) => row.original.startedDate ?? '' },
    { accessorKey: 'endDate', header: 'Дата окончания', cell: ({ row }: { row: TableRow<TaskDto> }) => row.original.endDate ?? '' }
]

onMounted(() => taskStore.listByUser())
</script>
