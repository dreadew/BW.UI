<script setup lang="ts">
import RoadmapHero from '~/components/Roadmap/RoadmapHero.vue';
import RoadmapTimeline from '~/components/Roadmap/RoadmapTimeline.vue';
import RoadmapFeedback from '~/components/Roadmap/RoadmapFeedback.vue';
useHead({ title: 'Дорожная карта' })
</script>

<template>
  <div>
    <RoadmapHero />
    <RoadmapTimeline />
    <RoadmapFeedback />
  </div>
</template>