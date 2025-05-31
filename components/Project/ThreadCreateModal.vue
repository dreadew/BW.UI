<template>
  <UModal v-model:open="open" title="Создать тред">
    <template #body>
      <UForm :state="formState" :schema="formSchema" @submit="onSubmit">
        <UFormField label="Заголовок" name="title" required>
          <UInput v-model="formState.title" required placeholder="Заголовок треда" />
        </UFormField>
        <UFormField label="Текст" name="text" required>
          <UInput v-model="formState.text" required placeholder="Текст треда" />
        </UFormField>
        <UButton type="submit" color="primary" class="mt-4" :loading="loading">Сохранить</UButton>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import { createProjectThreadRequestSchema } from '~/schemas/generated.schema'
const props = defineProps({
  open: Boolean,
  loading: Boolean,
  projectId: String,
  fromId: String,
  onSubmit: Function
})
const emit = defineEmits(['update:open', 'submit'])
const formState = ref({
  projectId: props.projectId || '',
  fromId: props.fromId || '',
  title: '',
  text: ''
})
const formSchema = toTypedSchema(createProjectThreadRequestSchema)
watch(() => props.open, (val) => { if (!val) formState.value = { projectId: props.projectId || '', fromId: props.fromId || '', title: '', text: '' } })
const onSubmit = () => emit('submit', formState.value)
</script>
