<template>
  <UCard variant="outline" class="relative group/task">
    <div class="flex items-center justify-between">
      <div class="space-y-2">
        <UBadge :color="priorityColor(task.priorityType?.name)" variant="soft" class="">
          {{ priorityLabel(task.priorityType?.name) }}
        </UBadge>
        <ULink :to="`/project/${projectId}/tasks/${task.id}`" class="block">
          <UiHeading class="line-clamp-2" size="xl">{{ task?.name }}</UiHeading>
        </ULink>
        <UiText size="xs" color="neutral" class="line-clamp-2">{{ task.content }}</UiText>
        <UiText size="xs" color="neutral">Срок: {{ task.startedDate ? task.endDate ? `${deserializedStartDate} -
          ${deserializedEndDate}` :
          deserializedStartDate : `Не установлен`
        }}</UiText>
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
import { DateUtils } from '~/utils/date.utils';
import type { ShortTaskDto } from '~/types/request.types';

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const props = defineProps<{ sectionId: string, task: ShortTaskDto }>()

const deserializedStartDate = computed(() => {
  return props.task.startedDate ? DateUtils.deserialize(props.task.startedDate)?.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) : '';
})

const deserializedEndDate = computed(() => {
  return props.task.endDate ? DateUtils.deserialize(props.task.endDate)?.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) : '';
})

const emit = defineEmits(['edit', 'delete'])
</script>
