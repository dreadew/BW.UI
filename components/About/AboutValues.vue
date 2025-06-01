<script setup lang="ts">
import ValueCard from '~/components/About/ValueCard.vue';
</script>

<template>
  <section class="py-16 border-b border-b-secondary/10">
    <div>
      <div class="mx-auto max-w-3xl space-y-8">
        <UiHeading level="2" size="3xl" class="font-bold">Наши ценности</UiHeading>
        <div class="grid gap-8 sm:grid-cols-2">
          <ValueCard icon="i-lucide-user" title="Ориентированность на пользователя"
            description="Мы ставим наших пользователей в центр всего, что мы делаем, постоянно ищем отзывы, чтобы улучшить наш продукт." />

          <ValueCard icon="i-lucide-lightbulb" title="Инновации"
            description="Мы принимаем перемены и постоянно находим новые идеи для решения сложных задач управления проектами." />

          <ValueCard icon="i-lucide-shield" title="Надежность"
            description="Мы создаем надежные системы, на которые команды могут полагаться изо дня в день, чтобы управлять своей самой важной работой." />

          <ValueCard icon="i-lucide-heart" title="Страсть"
            description="Мы любим свое дело и стремимся создавать инструменты, которые нравится использовать командам." />

          <ValueCard icon="i-lucide-proportions" title="Современный технологический стек"
            description="Работайте с новейшими технологиями и лучшими практиками в области разработки программного обеспечения и дизайна." />
        </div>
      </div>
    </div>
  </section>
</template>