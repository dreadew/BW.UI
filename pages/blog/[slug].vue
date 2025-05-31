<script setup lang="ts">
import BlogPost from '~/components/Blog/BlogPost.vue';
const route = useRoute();
const slug = route.params.slug as string;
</script>

<template>
  <BlogPost :slug="slug" />
</template>