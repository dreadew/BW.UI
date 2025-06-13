<template>
  <div class="mt-4">
    <UiHeading size="md" class="mb-2">Сессии</UiHeading>
    <BaseGrid is-readonly :store="sessionStore" :columns="columns" :editable="false" without-heading />
  </div>
</template>
<script setup lang="ts">
import type { TableRow } from '@nuxt/ui'
import { useSessionStore } from '~/stores/useSessionStore'
import type { SessionDto } from '~/types/request.types'

const sessionStore = useSessionStore()
const columns = [
  { accessorKey: 'location', header: 'IP' },
  { accessorKey: 'createdAt', header: 'Создана' },
  { accessorKey: 'isRevoked', header: 'Завершена', cell: ({ row }: { row: TableRow<SessionDto> }) => row.original.isRevoked ? 'Да' : 'Нет' }
]

// onMounted(() => {
//   sessionStore.list()
// })
</script>
