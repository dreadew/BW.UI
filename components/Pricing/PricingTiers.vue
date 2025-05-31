<script setup lang="ts">
const plans = [
  {
    name: 'Free',
    description: 'For small teams or personal projects',
    price: '$0',
    period: 'forever',
    features: [
      'Up to 5 team members',
      '3 active projects',
      'Basic kanban boards',
      'Simple task management',
      'Email support'
    ],
    cta: 'Get Started',
    popular: false,
    link: '/auth/sign-up'
  },
  {
    name: 'Pro',
    description: 'For growing teams and organizations',
    price: '$12',
    period: 'per user/month',
    features: [
      'Unlimited team members',
      'Unlimited projects',
      'Advanced task management',
      'Custom workflows',
      'Time tracking',
      'Analytics & reporting',
      'Priority support'
    ],
    cta: 'Start Free Trial',
    popular: true,
    link: '/auth/sign-up?plan=pro'
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'Enterprise SSO',
      'Custom onboarding',
      'Advanced security features',
      'SLA guarantees'
    ],
    cta: 'Contact Sales',
    popular: false,
    link: '/contact'
  }
]
</script>

<template>
  <section class="py-16 border-b border-b-secondary/10">
    <div>
      <div class="mx-auto max-w-5xl">
        <div class="grid gap-8 md:grid-cols-3">
          <div v-for="plan in plans" :key="plan.name"
            class="rounded-lg border border-secondary/10 bg-secondary/2 p-6 shadow-sm transition hover:shadow-md flex flex-col justify-between">
            <div>
              <h3 class="text-2xl font-bold mb-2">{{ plan.name }}</h3>
              <p class="text-muted-foreground mb-4">{{ plan.description }}</p>
              <div class="text-4xl font-bold mb-2">{{ plan.price }} <span class="text-base font-normal">{{ plan.period
                  }}</span></div>
              <ul class="mb-6 space-y-2">
                <li v-for="(feature, i) in plan.features" :key="i"
                  class="flex items-center gap-2 text-muted-foreground">
                  <UIcon name="i-lucide-check" class="text-primary" />
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
            <NuxtLink :to="plan.link">
              <UButton :variant="plan.popular ? 'solid' : 'subtle'" :color="plan.popular ? 'primary' : 'neutral'" class="w-full mt-4">{{ plan.cta }}</UButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>