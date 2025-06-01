<script setup lang="ts">
import ContactHero from '~/components/Contact/ContactHero.vue';
import ContactForm from '~/components/Contact/ContactForm.vue';
import ContactInfo from '~/components/Contact/ContactInfo.vue';
useHead({ title: 'Контакты' })
</script>

<template>
  <div>
    <ContactHero />
    <div class="py-16">
      <div class="grid gap-8 md:grid-cols-2">
        <ContactForm />
        <ContactInfo />
      </div>
    </div>
  </div>
</template>