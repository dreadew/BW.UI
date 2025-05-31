<script setup lang="ts">
const show = ref(false)
const props = defineProps<{
  modelValue: string
  placeholder?: string
  size: string
  required?: boolean
  class?: string
}>()
</script>

<template>
  <UInput
    v-model="props.modelValue"
    :placeholder="props.placeholder ? props.placeholder : Пароль"
    :type="show ? 'text' : 'password'"
    :ui="{ trailing: 'pe-1' }"
    :size="props.size"
    :required="props.required ? props.required : false"
    :class="props.class"
  >
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="show ? 'Hide password' : 'Show password'"
        :aria-pressed="show"
        aria-controls="password"
        @click="show = !show"
      />
    </template>
  </UInput>
</template>
