<script setup lang="ts">
import TeamMember from '~/components/About/TeamMember.vue';
</script>

<template>
  <section class="py-16 border-b border-b-secondary/10">
    <div>
      <div class="mx-auto max-w-3xl space-y-4">
        <UiHeading level="2" size="3xl" class="font-bold">Наша команда</UiHeading>
        <UiText class="text-muted-foreground">
          Мы - распределённая команда инженеров, дизайнеров и продуктовых мыслителей, увлечённых созданием лучшего
          инструмента для управления проектами.
        </UiText>
        <div class="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <TeamMember name="Alexandra Chen" role="Co-Founder & CEO" />
          <TeamMember name="Michael Rodriguez" role="Co-Founder & CTO" />
          <TeamMember name="Sarah Johnson" role="Head of Product" />
        </div>
        <div class="mt-8 text-center">
          <ULink to="/careers">
            <UButton variant="outline" color="primary">Присоединяйся к нашей команде</UButton>
          </ULink>
        </div>
      </div>
    </div>
  </section>
</template>