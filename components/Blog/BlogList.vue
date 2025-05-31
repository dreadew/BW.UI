<script setup lang="ts">
import BlogCard from './BlogCard.vue';

const blogPosts = [
  {
    id: 1,
    slug: 'maximizing-team-productivity',
    title: 'Maximizing Team Productivity with Agile Methodologies',
    excerpt: 'Learn how to implement agile practices that boost your team\'s productivity and delivery speed.',
    date: '2024-02-15',
    author: {
      name: 'Alexandra Chen',
      avatar: '/team/member1.jpg'
    },
    category: 'Productivity',
    image: '/blog/productivity.jpg'
  },
  {
    id: 2,
    slug: 'remote-team-collaboration',
    title: 'Building Strong Remote Team Collaboration',
    excerpt: 'Strategies for maintaining effective collaboration when your team is distributed across different locations.',
    date: '2024-01-28',
    author: {
      name: 'Michael Rodriguez',
      avatar: '/team/member2.jpg'
    },
    category: 'Remote Work',
    image: '/blog/remote-work.jpg'
  },
  {
    id: 3,
    slug: 'sprint-planning-guide',
    title: 'The Ultimate Guide to Effective Sprint Planning',
    excerpt: 'A comprehensive guide to planning sprints that deliver value and keep your team focused.',
    date: '2023-12-10',
    author: {
      name: 'Sarah Johnson',
      avatar: '/team/member3.jpg'
    },
    category: 'Agile',
    image: '/blog/sprint-planning.jpg'
  },
  {
    id: 4,
    slug: 'product-roadmap-tips',
    title: '5 Tips for Creating a Product Roadmap That Works',
    excerpt: 'Learn how to create a roadmap that communicates your vision clearly and adapts to change.',
    date: '2023-11-22',
    author: {
      name: 'Alexandra Chen',
      avatar: '/team/member1.jpg'
    },
    category: 'Product Management',
    image: '/blog/roadmap.jpg'
  },
  {
    id: 5,
    slug: 'measuring-team-performance',
    title: 'Measuring Team Performance: Beyond Velocity',
    excerpt: 'How to implement metrics that genuinely reflect your team\'s effectiveness and health.',
    date: '2023-10-05',
    author: {
      name: 'Michael Rodriguez',
      avatar: '/team/member2.jpg'
    },
    category: 'Analytics',
    image: '/blog/analytics.jpg'
  },
  {
    id: 6,
    slug: 'stakeholder-communication',
    title: 'Effective Stakeholder Communication in Agile Projects',
    excerpt: 'Strategies for keeping stakeholders informed and engaged throughout your project lifecycle.',
    date: '2023-09-18',
    author: {
      name: 'Sarah Johnson',
      avatar: '/team/member3.jpg'
    },
    category: 'Communication',
    image: '/blog/communication.jpg'
  }
];
</script>

<template>
  <section class="py-16">
    <div>
      <UiHeading level="2" size="3xl" class="mb-12 text-center">Последние статьи</UiHeading>
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <BlogCard v-for="post in blogPosts" :key="post.id" :post="post" />
      </div>
    </div>
  </section>
</template>