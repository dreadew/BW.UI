<template>
  <p :class="[
    baseClass,
    sizeClass,
    weightClass,
    colorClass,
    alignClass,
    customClass
  ]">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const colorOptions = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  neutral: 'text-neutral-400',
  "darker-neutral": 'text-neutral-700',
  error: 'text-red-600',
  success: 'text-green-600',
} as const;

type ColorKey = keyof typeof colorOptions;

const props = defineProps<{
  size?: string
  weight?: string
  color?: ColorKey
  align?: string
  class?: string | string[] | Record<string, boolean>
}>()

const baseClass = 'font-sans'
const sizeClass = computed(() => props.size ? `text-${props.size}` : '')
const weightClass = computed(() => props.weight ? `font-${props.weight}` : '')
const colorClass = computed(() => colorOptions[props.color ?? 'neutral'])
const alignClass = computed(() => props.align ? `text-${props.align}` : '')
const customClass = computed(() => props.class)
</script>
