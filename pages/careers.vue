<script setup lang="ts">
import CareersHero from '~/components/Careers/CareersHero.vue';
import CareersValues from '~/components/Careers/CareersValues.vue';
import CareersPositions from '~/components/Careers/CareersPositions.vue';
useHead({ title: 'Карьера' })
</script>

<template>
  <div>
    <CareersHero />
    <CareersValues />
    <CareersPositions />
  </div>
</template>