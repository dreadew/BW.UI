<script setup lang="ts">
defineProps<{
  name: string;
  role: string;
}>();
</script>

<template>
  <div>
    <div class="mx-auto h-32 w-32 rounded-full object-cover bg-secondary/10" />
    <UiHeading level="3" size="lg" class="mt-4 font-medium">{{ name }}</UiHeading>
    <UiText class="text-sm text-muted-foreground">{{ role }}</UiText>
  </div>
</template>