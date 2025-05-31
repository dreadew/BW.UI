<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-2">
      <slot name="icon" />
      <UiHeading level="4" size="sm">{{ title }}</UiHeading>
    </div>
    <ul class="space-y-2 text-sm text-muted-foreground flex flex-col">
      <slot name="links" />
    </ul>
  </div>
</template>