<script setup lang="ts">
</script>

<template>
  <section class="py-24 h-screen w-full">
    <div class="container space-y-16">
      <div class="flex flex-col gap-4 text-center">
        <UiHeading size="4xl" class="tracking-tight sm:text-6xl">
          Agile Project Management <br /> который работает для вашей команды
        </UiHeading>
        <UiText size="xl" class="mx-auto max-w-2xl">
          Планируйте, отслеживайте и отправляйте свои проекты с эффективностью и четкостью.
          Hexaend помогает командам любого размера быстрее создавать ценности
        </UiText>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <UButton>
            <NuxtLink to="/auth/sign-up" class="text-primary-foreground">Попробовать бесплатно</NuxtLink>
          </UButton>
          <UButton variant="outline">
            <NuxtLink to="/demo">Запросить демо</NuxtLink>
          </UButton>
        </div>
      </div>
      <div class="mx-auto mt-24 max-w-5xl">
        <div class="h-[37rem] w-full rounded-2xl border border-secondary/10 bg-secondary/2" />
      </div>
    </div>
  </section>
</template>