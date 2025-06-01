<script setup lang="ts">
const features = [
  {
    title: 'Intuitive Kanban Boards',
    description: 'Visualize your workflow and optimize your process with customizable boards that adapt to your team`s unique needs.',
    image: '/features/kanban.jpg',
    align: 'right'
  },
  {
    title: 'Advanced Sprint Planning',
    description: 'Plan and track sprints effectively with story points, capacity planning, and burndown charts.',
    image: '/features/sprint.jpg',
    align: 'left'
  },
  {
    title: 'Real-time Analytics',
    description: 'Make data-driven decisions with real-time dashboards and customizable reports that reveal team performance.',
    image: '/features/analytics.jpg',
    align: 'right'
  },
  {
    title: 'Team Collaboration',
    description: 'Foster teamwork with comments, mentions, file sharing, and integrations with the tools your team already uses.',
    image: '/features/team.jpg',
    align: 'left'
  }
];
</script>

<template>
  <section class="py-16">
    <div>
      <div class="space-y-24">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="flex flex-col lg:flex-row gap-12 items-center"
          :class="index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'"
        >
          <div class="flex-1 space-y-4">
            <h2 class="text-3xl font-bold">{{ feature.title }}</h2>
            <UiText color="neutral" class="text-lg text-balance">{{ feature.description }}</UiText>
            <UButton variant="outline" color="primary">Узнать больше</UButton>
          </div>
          <div v-if="feature.image" class="flex-1 flex justify-center">
            <img :src="feature.image" :alt="feature.title" class="rounded-lg shadow-lg border border-muted max-w-md w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>