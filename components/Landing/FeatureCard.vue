<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="space-y-4 rounded-lg border border-secondary/10 p-6 bg-secondary/2">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
      <UIcon :name="icon" class="text-xl text-primary" />
    </div>
    <UiHeading size="xl">{{ title }}</UiHeading>
    <UiText>{{ description }}</UiText>
  </div>
</template>