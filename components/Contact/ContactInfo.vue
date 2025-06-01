<template>
  <div class="space-y-8">
    <div>
      <UiHeading size="2xl" class="mb-4">Контакты</UiHeading>
      <UiText class="mb-6">
        Свяжитесь с нами любым из приведенных ниже способов. Обычно мы отвечаем в течение 24 часов в рабочие дни.
      </UiText>
    </div>

    <div class="space-y-6">
      <div class="flex items-start space-x-4">
        <div class="bg-primary/10 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <UiHeading size="lg">Эл. почта</UiHeading>
          <UiText>support@hexaend.com</UiText>
        </div>
      </div>

      <div class="flex items-start space-x-4">
        <div class="bg-primary/10 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <div>
          <UiHeading size="lg">Номер телефона</UiHeading>
          <UiText>+1 (555) 123-4567</UiText>
          <UiText class="mt-1">Mon-Fri, 9AM-5PM EST</UiText>
        </div>
      </div>

      <div class="flex items-start space-x-4">
        <div class="bg-primary/10 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <UiHeading size="lg">Офис</UiHeading>
          <UiText>
            123 Innovation Drive<br>
            San Francisco, CA 94107<br>
            United States
          </UiText>
        </div>
      </div>
    </div>

    <div class="pt-6 border-t border-t-secondary/10">
      <UiHeading size="lg" class="mb-4">Соц. сети</UiHeading>
      <div class="flex space-x-4">
        <UButton v-for="(icon, idx) in icons" :key="idx" icon :to="icon.href" target="_blank" color="neutral" variant="ghost" size="lg">
          <UIcon :name="icon.name" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const icons = [
  { name: 'i-lucide-facebook', href: '#' },
  { name: 'i-lucide-twitter', href: '#' },
  { name: 'i-lucide-instagram', href: '#' },
  { name: 'i-lucide-linkedin', href: '#' }
]
</script>