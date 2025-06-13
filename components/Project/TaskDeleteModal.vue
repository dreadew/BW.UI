<template>
  <UModal :open="open" @update:open="$emit('update:open', $event)" title="Удалить задачу?">
    <template #body>
      <UiText color="darker-neutral">
        Вы уверены, что хотите удалить задачу <b>{{ task?.name }}</b>?
      </UiText>
    </template>
    <template #footer>
      <div class="w-full flex justify-end gap-2">
        <UButton @click="$emit('update:open', false)">Отмена</UButton>
        <UButton color="error" @click="$emit('confirm')" :loading="loading">Удалить</UButton>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { TaskDto } from '~/types/request.types';

defineProps<{
  open: boolean;
  loading: boolean;
  task: TaskDto
}>()
</script>
