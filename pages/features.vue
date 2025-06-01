<script setup lang="ts">
import FeatureHero from '~/components/Features/FeatureHero.vue';
import FeatureDetail from '~/components/Features/FeatureDetail.vue';
import CtaSection from '~/components/Landing/CtaSection.vue';
useHead({ title: 'Особенности' })
</script>

<template>
  <div>
    <FeatureHero />
    <FeatureDetail />
    <CtaSection />
  </div>
</template>