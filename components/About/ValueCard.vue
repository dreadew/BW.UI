<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="space-y-3">
    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
      <UIcon :name="icon" class="text-white text-lg" />
    </div>
    <UiHeading level="3" size="xl" class="font-bold">{{ title }}</UiHeading>
    <UiText class="text-muted-foreground">
      {{ description }}
    </UiText>
  </div>
</template>