<template>
  <component
    :is="tag"
    :class="[
      baseClass,
      sizeClass,
      weightClass,
      colorClass,
      alignClass,
      customClass,
      'break-words',
      'leading-tight',
      'truncate',
      'sm:whitespace-normal',
      'sm:truncate',
      'sm:leading-snug',
      'text-balance',
      'max-w-full',
      'overflow-hidden',
      'sm:text-clip',
      'sm:overflow-visible',
      'sm:max-w-none'
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const colorOptions = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  neutral: 'text-neutral',
  gray: 'text-gray-900',
  danger: 'text-red-600',
  success: 'text-green-600',
} as const

type ColorKey = keyof typeof colorOptions;

const props = defineProps<{
  level?: number | string
  size?: string
  weight?: string
  color?: ColorKey
  align?: string
  class?: string | string[] | Record<string, boolean>
}>()

const tag = computed(() => `h${props.level ?? 1}`)
const baseClass = 'font-heading'
const sizeClass = computed(() => props.size ? `text-${props.size}` : `text-${6-Number(props.level ?? 1)+1}xl`)
const weightClass = computed(() => props.weight ? `font-${props.weight}` : 'font-bold')
const colorClass = computed(() => colorOptions[props.color ?? 'neutral'])
const alignClass = computed(() => props.align ? `text-${props.align}` : '')
const customClass = computed(() => props.class)
</script>

