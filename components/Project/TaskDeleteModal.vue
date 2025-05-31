<template>
  <UModal v-model:open="open" title="Удалить задачу?">
    <template #body>
      <UiText>Вы уверены, что хотите удалить задачу <b>{{ task?.title }}</b>?</UiText>
      <div class="flex justify-end gap-2 mt-4">
        <UButton @click="$emit('update:open', false)">Отмена</UButton>
        <UButton color="danger" @click="$emit('confirm')" :loading="loading">Удалить</UButton>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
const props = defineProps({
  open: Boolean,
  loading: Boolean,
  task: Object
})
</script>
