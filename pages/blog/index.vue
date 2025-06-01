<script setup lang="ts">
import BlogHero from '~/components/Blog/BlogHero.vue';
import BlogList from '~/components/Blog/BlogList.vue';
useHead({ title: 'Блог' });
</script>

<template>
  <div>
    <BlogHero />
    <BlogList />
  </div>
</template>