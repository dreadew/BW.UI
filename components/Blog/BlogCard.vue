<script setup lang="ts">
defineProps<{
  post: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: {
      name: string;
      avatar: string;
    };
    category: string;
    image: string;
  }
}>();

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<template>
  <div class="group rounded-lg border border-secondary/10 overflow-hidden bg-secondary/2">
    <ULink :to="`/blog/${post.slug}`" class="block">
      <div class="relative h-48 overflow-hidden">
        <img v-if="post.image" :src="post.image" :alt="post.title"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 bg-secondary/10" />
        <div class="absolute top-4 right-4">
          <UiText as="span" class="bg-primary rounded-full px-3 py-1 text-xs font-medium text-primary-foreground">
            {{ post.category }}
          </UiText>
        </div>
      </div>

      <div class="p-6">
        <UiHeading level="3" size="xl" class="mb-2 group-hover:text-primary transition-colors">
          {{ post.title }}
        </UiHeading>
        <UiText class="text-muted-foreground mb-4">{{ post.excerpt }}</UiText>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img v-if="post.author.avatar" :src="post.author.avatar" :alt="post.author.name"
              class="h-8 w-8 rounded-full object-cover bg-secondary/10" />
            <UiText as="span" class="text-sm text-muted-foreground">{{ post.author.name }}</UiText>
          </div>
          <UiText as="time" class="text-sm text-muted-foreground">{{ formatDate(post.date) }}</UiText>
        </div>
      </div>
    </ULink>
  </div>
</template>