<template>
  <div>
    <UTable :data="sessions" :columns="columns" class="w-full" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserSessions } from '~/composables/useUserSessions'

const props = defineProps<{ userId: string }>()
const { getSessions } = useUserSessions()
const sessions = ref([])
const columns = [
  { accessorKey: 'device', header: 'Устройство' },
  { accessorKey: 'ip', header: 'IP' },
  { accessorKey: 'createdAt', header: 'Создана' },
  { accessorKey: 'lastActive', header: 'Последняя активность' },
  { accessorKey: 'current', header: 'Текущая', cell: ({ row }) => row.original.current ? 'Да' : '' }
]

onMounted(async () => {
  sessions.value = await getSessions(props.userId)
})
</script>
