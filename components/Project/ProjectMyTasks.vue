<template>
    <div>
        <BaseGrid without-heading :store="taskStore" :columns="columns" editable :custom-list-fn="listByUserVoid"
            is-readonly />
    </div>
</template>
<script setup lang="ts">
import type { TableRow } from '@nuxt/ui'
import { onMounted } from 'vue'
import { useTaskStore } from '~/stores/useTaskStore'
import type { TaskDto } from '~/types/request.types'
import { DateUtils } from '~/utils/date.utils'

const taskStore = useTaskStore()
const columns = [
    { accessorKey: 'name', header: 'Название', cell: ({ row }: { row: TableRow<TaskDto> }) => row.original.name ?? '' },
    { accessorKey: 'content', header: 'Описание', cell: ({ row }: { row: TableRow<TaskDto> }) => row.original.content ?? '' },
    { accessorKey: 'priorityType.name', header: 'Приоритет', cell: ({ row }: { row: TableRow<TaskDto> }) => row.original.priorityType?.name ?? '' },
    { accessorKey: 'startedDate', header: 'Дата начала', cell: ({ row }: { row: TableRow<TaskDto> }) => row.original.startedDate ? DateUtils.deserialize(row.original.startedDate)?.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '' },
    { accessorKey: 'endDate', header: 'Дата окончания', cell: ({ row }: { row: TableRow<TaskDto> }) => row.original.endDate ? DateUtils.deserialize(row.original.endDate)?.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '' }
]

const listByUserVoid = async () => { await taskStore.listByUser(); };

onMounted(() => taskStore.listByUser())
</script>
