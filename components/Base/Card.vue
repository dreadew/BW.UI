<template>
  <UCard variant="outline" class="flex-1 min-w-[20rem] flex flex-col justify-between">
    <div class="flex items-center gap-3">
      <UAvatar :src="image" :alt="title" class="w-16 h-16" />
      <div class="flex flex-col">
        <UiHeading size="lg">{{ title }}</UiHeading>
        <UiText size="sm" color="darker-neutral">
          {{ subtitle || (date ? `Дата создания: ${formattedDate}` : '') }}
        </UiText>
        <slot name="info" :entity="entity" />
      </div>
    </div>
    <div class="flex justify-between gap-2 mt-4">
      <slot name="actions" :entity="entity" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DateUtils } from '~/utils/date.utils'

const props = defineProps<{ entity: any, title: string, subtitle?: string, image?: string, date?: string }>()
const formattedDate = computed(() => props.date ? DateUtils.deserialize(props.date)?.toLocaleDateString() : '')
</script>
