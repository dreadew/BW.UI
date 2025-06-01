<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="space-y-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
      <UIcon :name="icon" class="text-primary text-lg" />
    </div>
    <UiHeading level="3" size="xl" class="font-bold">{{ title }}</UiHeading>
    <UiText color="neutral">
      {{ description }}
    </UiText>
  </div>
</template>