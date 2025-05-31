<template>
  <div>
    <component :is="is404 ? NotFound : DefaultError" :error="error" />
  </div>
</template>
<script setup lang="ts">
import NotFound from '~/pages/not-found.vue'
const DefaultError = defineNuxtComponent({
  template: `<div class="flex flex-col items-center justify-center min-h-[60vh]">
    <UCard class="flex flex-col items-center justify-center p-8">
      <UIcon name='i-lucide-alert-triangle' class='text-5xl text-primary mb-4' />
      <UiHeading size='2xl'>Произошла ошибка</UiHeading>
      <UiText color='gray' class='mt-2 mb-4'>{{ error?.message || 'Неизвестная ошибка' }}</UiText>
      <NuxtLink to="/" class="w-full flex justify-end">
        <UButton color="primary">На главную</UButton>
      </NuxtLink>
    </UCard>
  </div>`
})
const props = defineProps<{ error: any }>()
const is404 = computed(() => props.error?.statusCode === 404)
</script>
