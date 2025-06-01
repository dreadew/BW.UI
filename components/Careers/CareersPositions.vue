<script setup lang="ts">
const positions = [
  {
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'We`re looking for an experienced frontend developer to help build and improve our user interfaces. You`ll work closely with designers and backend engineers to deliver exceptional user experiences.'
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Full-time',
    description: 'Join our product team to define product strategy, gather and prioritize requirements, and work with cross-functional teams to deliver features that delight our customers.'
  },
  {
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Help us create intuitive, beautiful, and accessible user interfaces. You`ll collaborate with product and engineering to design experiences that make complex workflows feel simple.'
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build and maintain our cloud infrastructure, CI/CD pipelines, and monitoring systems to ensure our application is reliable, secure, and performant.'
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    description: 'Be the bridge between our customers and our product. You`ll help customers implement HexaEnd, provide training, and ensure they get maximum value from our platform.'
  }
];
</script>

<template>
  <section class="py-16">
    <div>
      <div class="text-center mb-12">
        <UiHeading level="2">Вакансии</UiHeading>
        <UiText class="mx-auto mt-4 max-w-2xl">
          Присоединяйтесь к нашей команде и помогайте формировать будущее управления проектами
        </UiText>
      </div>

      <div class="space-y-6">
        <div v-for="(position, index) in positions" :key="index" class="rounded-lg border border-secondary/10 bg-secondary/2 p-6 shadow-sm">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 mt-1">
                <UIcon name="i-lucide-briefcase" class="text-primary text-lg" />
              </div>
              <div class="space-y-1">
                <UiHeading level="3">{{ position.title }}</UiHeading>
                <div class="flex flex-wrap gap-2 text-sm">
                  <UiText color="neutral">{{ position.department }}</UiText>
                  <UiText color="neutral">•</UiText>
                  <UiText color="neutral">{{ position.location }}</UiText>
                  <UiText color="neutral">•</UiText>
                  <UiText color="neutral">{{ position.type }}</UiText>
                </div>
              </div>
            </div>
            <UButton color="primary" variant="subtle">Отправить заявку</UButton>
          </div>
          <UiText color="neutral" class="mt-4">{{ position.description }}</UiText>
        </div>
      </div>

      <div class="mt-12 text-center">
        <UiText class="mb-4">Не видите вакансии, которая соответствует вашим навыкам?</UiText>
        <UButton color="neutral" variant="outline">Отправьте ваше резюме</UButton>
      </div>
    </div>
  </section>
</template>