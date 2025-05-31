<script setup lang="ts">
const features = [
  {
    title: 'Intuitive Kanban Boards',
    description: 'Visualize your workflow and optimize your process with customizable boards that adapt to your team`s unique needs.',
    image: '/features/kanban.png',
    align: 'right'
  },
  {
    title: 'Advanced Sprint Planning',
    description: 'Plan and track sprints effectively with story points, capacity planning, and burndown charts.',
    image: '/features/sprint.png',
    align: 'left'
  },
  {
    title: 'Real-time Analytics',
    description: 'Make data-driven decisions with real-time dashboards and customizable reports that reveal team performance.',
    align: 'right'
  },
  {
    title: 'Team Collaboration',
    description: 'Foster teamwork with comments, mentions, file sharing, and integrations with the tools your team already uses.',
    align: 'left'
  }
];
</script>

<template>
  <section class="py-16">
    <div>
      <div class="space-y-24">
        <div v-for="(feature, index) in features" :key="index" class="grid gap-12 items-center lg:grid-cols-2"
          :class="{ 'lg:grid-flow-col': feature.align === 'left' }">
          <div class="space-y-4">
            <h2 class="text-3xl font-bold">{{ feature.title }}</h2>
            <p class="text-lg text-muted-foreground text-balance">{{ feature.description }}</p>
            <UButton variant="outline" color="primary">Узнать больше</UButton>
          </div>
          <div class="rounded-lg overflow-hidden shadow-lg shadow-accent border border-muted">
            <div class="min-h-[55rem] w-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>