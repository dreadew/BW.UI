<template>
  <UModal :open="open" @update:open="emit('update:open', $event)" title="Создать секцию">
    <template #body>
      <UForm :state="formState" :schema="formSchema" @submit="onSubmit">
        <UFormField label="Название" name="name" required>
          <UInput class="w-full" v-model="formState.name" required placeholder="Название секции" />
        </UFormField>
        <UButton type="submit" color="primary" class="mt-4 float-right" :loading="loading">Сохранить</UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { createSectionRequestSchema } from '~/schemas/generated.schema'
import type { CreateSectionRequest } from '~/types/request.types'

const props = defineProps<{
  open: boolean;
  loading: boolean;
  projectId: string;
  onSubmit: (data: CreateSectionRequest) => void;
}>()

const emit = defineEmits(['update:open', 'submit'])
const formState = ref<CreateSectionRequest>({
  id: props.projectId || '',
  name: ''
})

const formSchema = createSectionRequestSchema;

watch(() => props.open, (val) => { if (!val) formState.value = { id: props.projectId || '', name: '' } })

const onSubmit = () => emit('submit', formState.value)
</script>
