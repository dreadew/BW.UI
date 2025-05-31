<template>
  <section class="py-16">
    <div>
      <div class="mx-auto max-w-3xl">
        <UiHeading size="3xl" class="text-center mb-10">Часто задаваемые вопросы</UiHeading>

        <div class="space-y-5">
          <div v-for="(faq, index) in faqs" :key="index" class="border border-secondary/10 rounded-md shadow-sm bg-secondary/2">
            <div class="px-4 py-3 flex justify-between items-center cursor-pointer" @click="faq.open = !faq.open">
              <UiHeading size="lg" class="font-medium">{{ faq.question }}</UiHeading>
              <UIcon name="i-lucide-chevron-down" class="h-5 w-5 transition-transform duration-200"
                :class="{ 'rotate-180': faq.open }" />
            </div>
            <div v-show="faq.open" class="px-4 py-3 text-muted-foreground border-t border-t-secondary/10">
              <UiText>{{ faq.answer }}</UiText>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const faqs = reactive([
  {
    question: 'Can I try HexaEnd before paying?',
    answer: 'Yes, we offer a free tier that never expires. For our paid plans, we offer a 14-day free trial with no credit card required.',
    open: true
  },
  {
    question: 'What happens when my trial ends?',
    answer: 'When your trial ends, you can choose to upgrade to a paid plan or downgrade to the free tier. We`ll never automatically charge you.',
    open: false
  },
  {
    question: 'Can I change plans later?',
    answer: 'Absolutely! You can upgrade, downgrade, or cancel your plan at any time. Changes to your plan will be applied immediately.',
    open: false
  },
  {
    question: 'Do you offer discounts for nonprofits or educational institutions?',
    answer: 'Yes, we offer special pricing for nonprofits, educational institutions, and open-source projects. Contact our sales team for details.',
    open: false
  },
  {
    question: 'Is there a limit to how many projects I can create?',
    answer: 'The Free plan limits you to 3 active projects. Pro and Enterprise plans offer unlimited projects.',
    open: false
  }
]);
</script>