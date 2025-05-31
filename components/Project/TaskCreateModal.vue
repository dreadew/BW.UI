<template>
  <UModal v-model:open="open" title="Создать задачу">
    <template #body>
      <UForm :state="formState" :schema="formSchema" @submit="onSubmit">
        <UFormField label="ID" name="id" required>
          <UInput v-model="formState.id" required placeholder="ID задачи" />
        </UFormField>
        <UFormField label="Название" name="name" required>
          <UInput v-model="formState.name" required placeholder="Название задачи" />
        </UFormField>
        <UFormField label="Архивировать?" name="isArchived" required>
          <UCheckbox v-model="formState.isArchived" label="Архивировать" />
        </UFormField>
        <UFormField label="Дата начала" name="startedDate" required>
          <UInput v-model="formState.startedDate" required placeholder="Дата начала (YYYY-MM-DD)" />
        </UFormField>
        <UFormField label="Дата окончания" name="endDate" required>
          <UInput v-model="formState.endDate" required placeholder="Дата окончания (YYYY-MM-DD)" />
        </UFormField>
        <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { createTaskRequestSchema } from '~/schemas/generated.schema'
const props = defineProps({
  open: Boolean,
  loading: Boolean,
  onSubmit: Function
})
const emit = defineEmits(['update:open', 'submit'])
const formState = ref({
  id: '',
  name: '',
  isArchived: false,
  startedDate: '',
  endDate: ''
})
const formSchema = toTypedSchema(createTaskRequestSchema)
watch(() => props.open, (val) => { if (!val) formState.value = { id: '', name: '', isArchived: false, startedDate: '', endDate: '' } })
const onSubmit = () => emit('submit', formState.value)
</script>
