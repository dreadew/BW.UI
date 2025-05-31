<template>
  <section class="py-24">
    <div>
      <UiHeading size="3xl" class="mb-12 text-center">Ключевые особенности</UiHeading>
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard icon="i-lucide-kanban" title="Kanban доски"
          description="Визуализируйте свой рабочий процесс с помощью настраиваемых досок Kanban, которые адаптируются к потребностям вашей команды." />

        <FeatureCard icon="i-lucide-bar-chart" title="Расширенная аналитика"
          description="Получите информацию о производительности вашей команды с помощью показателей в реальном времени и настраиваемых отчетов." />

        <FeatureCard icon="i-lucide-calendar" title="Планирование спринтов"
          description="Планируйте и отслеживайте спринты с легкостью, чтобы ваша команда всегда была сосредоточена на создании ценности." />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FeatureCard from '~/components/Landing/FeatureCard.vue';
</script>