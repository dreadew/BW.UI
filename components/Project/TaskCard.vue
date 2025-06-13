<template>
  <UCard variant="outline" class="relative group/task">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <UBadge :color="priorityColor(task.priorityType?.name)" variant="soft" class="">
          {{ priorityLabel(task.priorityType?.name) }}
        </UBadge>
        <ULink :to="`/project/${projectId}/tasks/${task.id}`" class="block">
          <UiHeading class="line-clamp-2" size="xl">{{ task?.name }}</UiHeading>
        </ULink>
        <UiText size="xs" color="neutral">Исполнители: {{ task?.assignees?.length ?? 'отсутствуют' }}</UiText>
        <UiText size="xs" color="neutral">Срок: {{ task?.startedDate && task.endDate ? `${new
          Date(task.startedDate).toLocaleDateString()} - ${new Date(task.endDate).toLocaleDateString()}` : `Не
          установлен` }}</UiText>
      </div>
      <div class="flex gap-1 opacity-0 group-hover/task:opacity-100 transition">
        <UTooltip text="Редактировать">
          <UButton size="xs" color="secondary" icon="i-heroicons-pencil" variant="subtle"
            @click="$emit('edit', task)" />
        </UTooltip>
        <UTooltip text="Удалить">
          <UButton size="xs" color="error" icon="i-heroicons-trash" variant="subtle" @click="$emit('delete', task)" />
        </UTooltip>
      </div>
    </div>
  </UCard>
</template>
<script setup lang="ts">
import type { ShortTaskDto } from '~/types/request.types';

const route = useRoute()
const projectId = computed(() => route.params.id as string)
defineProps<{ sectionId: string, task: ShortTaskDto }>()
const emit = defineEmits(['edit', 'delete'])
</script>
