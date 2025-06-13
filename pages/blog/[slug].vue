<script setup lang="ts">
import BlogPost from '~/components/Blog/BlogPost.vue';
const route = useRoute();
const slug = computed(() => route.params.slug as string);
useHead({ title: `Блог - ${slug}` });
</script>

<template>
  <BlogPost :slug="slug" />
</template>