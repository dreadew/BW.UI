<template>
  <UModal v-model:open="open" title="Создать секцию">
    <template #body>
      <UForm :state="formState" :schema="formSchema" @submit="onSubmit">
        <UFormField label="Название" name="name" required>
          <UInput v-model="formState.name" required placeholder="Название секции" />
        </UFormField>
        <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { createSectionRequestSchema } from '~/schemas/generated.schema'
const props = defineProps({
  open: Boolean,
  loading: Boolean,
  projectId: String,
  onSubmit: Function
})
const emit = defineEmits(['update:open', 'submit'])
const formState = ref({
  projectId: props.projectId || '',
  name: ''
})
const formSchema = toTypedSchema(createSectionRequestSchema)
watch(() => props.open, (val) => { if (!val) formState.value = { projectId: props.projectId || '', name: '' } })
const onSubmit = () => emit('submit', formState.value)
</script>
